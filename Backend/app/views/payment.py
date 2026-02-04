from rest_framework import status
from rest_framework.views import APIView
from app.utils.notify import notifyMessage
import razorpay
import hmac
import hashlib
import json
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from app.models.booking import Booking, BookingStatus, PaymentStatus
from app.permission import IsOwner


class ConfirmPaymentView(APIView):
	"""
	Legacy/manual confirmation endpoint that marks a booking as paid.
	Kept for backward compatibility.
	"""
	permission_classes = [IsAuthenticated, IsOwner]

	def post(self, request, booking_id):
		booking = Booking.objects.get(id=booking_id)

		booking.payment_status = PaymentStatus.SUCCESS
		booking.payment_provider = "MANUAL"
		booking.provider_payment_id = "MANUAL_" + str(booking.id)

		booking.status = BookingStatus.CONFIRMED
		booking.save()

		notifyMessage(
			f"Your booking with id {booking_id} has been confirmed",
			booking.custumer.phone_no,
		)
		notifyMessage(
			f"The booking with id {booking_id} has been confirmed for {booking.turf.business.name} at {booking.booking_date} from {booking.start_time} to {booking.end_time}",
			booking.turf.business.user.phone_no,
		)

		return Response({"msg": "Payment successful, booking confirmed"})


class CreateRazorpayOrderView(APIView):
	"""Create a Razorpay order for a booking. URL: /payment/razorpay/create/<booking_id>/"""
	permission_classes = [IsAuthenticated]

	def post(self, request, booking_id=None):
		# Only booking owner can create order
		try:
			booking = Booking.objects.get(id=booking_id)
		except Booking.DoesNotExist:
			return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

		# Ensure requesting user owns the booking
		if booking.user != request.user:
			return Response({"error": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

		# Use booking.amount (in rupees) and create razorpay order in paise
		amount_paise = int(booking.amount * 100)

		client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
		try:
			order = client.order.create({
				"amount": amount_paise,
				"currency": "INR",
				"receipt": f"booking_{booking.id}",
				"payment_capture": 1,
			})
		except Exception as e:
			return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

		# Mark booking as initiated/pending (if not already)
		booking.payment_status = PaymentStatus.INITIATED
		booking.save()

		return Response({
			"key": settings.RAZORPAY_KEY_ID,
			"order": order,
			"turf_name": booking.court.turf.name if hasattr(booking, 'court') else None,
			"prefill": {"name": booking.user.username if hasattr(booking.user, 'username') else '', "email": getattr(booking.user, 'email', '')},
		})


class RazorpayVerifyView(APIView):
	"""Verify payment signature sent from client after checkout."""
	permission_classes = [IsAuthenticated]

	def post(self, request):
		data = request.data
		booking_id = data.get('booking_id')
		razorpay_payment_id = data.get('razorpay_payment_id')
		razorpay_order_id = data.get('razorpay_order_id')
		razorpay_signature = data.get('razorpay_signature')

		if not all([booking_id, razorpay_payment_id, razorpay_order_id, razorpay_signature]):
			return Response({"error": "Missing parameters"}, status=status.HTTP_400_BAD_REQUEST)

		# verify signature: hmac_sha256(order_id + '|' + payment_id, key_secret)
		msg = f"{razorpay_order_id}|{razorpay_payment_id}".encode('utf-8')
		secret = settings.RAZORPAY_KEY_SECRET.encode('utf-8')
		expected = hmac.new(secret, msg, hashlib.sha256).hexdigest()

		if expected != razorpay_signature:
			return Response({"error": "Invalid signature"}, status=status.HTTP_400_BAD_REQUEST)

		try:
			booking = Booking.objects.get(id=booking_id)
		except Booking.DoesNotExist:
			return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

		# Ensure the user verifying is the booking owner
		if booking.user != request.user:
			return Response({"error": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

		booking.payment_status = PaymentStatus.SUCCESS
		booking.payment_provider = "RAZORPAY"
		booking.provider_payment_id = razorpay_payment_id
		booking.status = BookingStatus.CONFIRMED
		booking.save()

		notifyMessage(
			f"Your booking with id {booking_id} has been confirmed",
			booking.user.phone_no if hasattr(booking.user, 'phone_no') else None,
		)

		return Response({"status": "ok"})


@method_decorator(csrf_exempt, name='dispatch')
class RazorpayWebhookView(APIView):
	"""Endpoint for Razorpay webhooks. If RAZORPAY_WEBHOOK_SECRET is set it will verify the signature."""
	permission_classes = []

	def post(self, request):
		payload = request.body
		signature = request.META.get('HTTP_X_RAZORPAY_SIGNATURE', '')
		webhook_secret = getattr(settings, 'RAZORPAY_WEBHOOK_SECRET', '')
		print(f"[Razorpay Webhook] Received webhook request. Signature: {signature}")

		if webhook_secret:
			expected = hmac.new(webhook_secret.encode('utf-8'), payload, hashlib.sha256).hexdigest()
			if not hmac.compare_digest(expected, signature):
				return Response(status=400)

		try:
			event = json.loads(payload.decode('utf-8'))
			print(f"[Razorpay Webhook] Event data: {json.dumps(event, indent=2)}")
		except Exception as e:
			print(f"[Razorpay Webhook] Error parsing JSON payload: {str(e)}")
			return Response(status=400)

		# handle payment events
		entity = event.get('payload', {}).get('payment', {}).get('entity', {})
		receipt = (entity.get('notes') or {}).get('receipt') or entity.get('receipt')
		payment_id = entity.get('id', 'N/A')
		status_str = entity.get('status', 'N/A')
		order_id = entity.get('order_id', 'N/A')
		
		print(f"[Razorpay Webhook] Payment Status: {status_str}")
		print(f"[Razorpay Webhook] Payment ID: {payment_id}")
		print(f"[Razorpay Webhook] Order ID: {order_id}")
		print(f"[Razorpay Webhook] Receipt: {receipt}")
		print(f"[Razorpay Webhook] Full Entity: {json.dumps(entity, indent=2)}")
		# In our order creation we set receipt to booking_{id}
		if receipt and str(receipt).startswith('booking_'):
			try:
				booking_id = receipt.split('_', 1)[1]
				booking = Booking.objects.get(id=booking_id)
				# If payment captured/authorized, mark success
				status_str = entity.get('status')
				print(f"[Razorpay Webhook] Processing booking {booking_id} with status: {status_str}")
				
				if status_str in ('captured', 'authorized'):
					try:
						booking.payment_status = PaymentStatus.SUCCESS
						booking.payment_provider = 'RAZORPAY'
						booking.provider_payment_id = entity.get('id')
						booking.status = BookingStatus.CONFIRMED
						booking.save()
						print(f"[Razorpay Webhook] Successfully updated booking {booking_id} to CONFIRMED status")
					except Exception as e:
						print(f"[Razorpay Webhook] Error updating booking {booking_id}: {str(e)}")
				else:
					print(f"[Razorpay Webhook] Payment status {status_str} does not require booking update")
			except Exception:
				pass

		return Response({"status": "ok"})
