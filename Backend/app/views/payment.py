from decimal import Decimal
import hmac, hashlib, json, razorpay
from app.utils.notify import notifyMessage
from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from app.models.booking import Booking, BookingStatus, PaymentStatus
from app.permission import IsOwner

class ConfirmPaymentView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def post(self, request, booking_id):
        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found"}, status=404)

        if booking.payment_status == PaymentStatus.SUCCESS:
            return Response({"error": "Payment already completed"}, status=400)

        booking.payment_status = PaymentStatus.SUCCESS
        booking.payment_provider = "MANUAL"
        booking.provider_payment_id = f"MANUAL_{booking.id}"
        booking.status = BookingStatus.CONFIRMED
        booking.save()

        notifyMessage(
            f"Your booking with id {booking_id} has been confirmed",
            booking.custumer.phone_no,
        )

        notifyMessage(
            f"Booking {booking_id} confirmed for {booking.turf.business.name} "
            f"on {booking.booking_date} from {booking.start_time} to {booking.end_time}",
            booking.turf.business.user.phone_no,
        )

        return Response({"msg": "Payment successful, booking confirmed"})


class CreateRazorpayOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, booking_id):
        order = None
        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found"}, status=404)

        if booking.user != request.user:
            return Response({"error": "Not allowed"}, status=403)

        if booking.payment_status == PaymentStatus.SUCCESS:
            return Response({"error": "Payment already completed"}, status=400)

        client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )
        
        if booking.provider_payment_id:
            order = client.order.fetch(booking.provider_payment_id)
        
        amount_paise = int(Decimal(booking.amount) * 100)

        if not order:
            try:
                order = client.order.create({
                    "amount": amount_paise,
                    "currency": "INR",
                    "receipt": f"b_{booking.id}",
                    "payment_capture": 1
                })
                
            except Exception as e:
                return Response({"error": str(e)}, status=400)

        booking.payment_status = PaymentStatus.INITIATED
        booking.provider_payment_id = order["id"]
        booking.save()

        return Response({
            "key": settings.RAZORPAY_KEY_ID,
            "order": order,
            "amount": amount_paise,
            "currency": "INR",
            "prefill": {
                "name": booking.user.name or "",
                "phone": booking.user.phone_no or "",
            }
        })

class RazorpayVerifyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data

        booking_id = data.get("booking_id")
        payment_id = data.get("razorpay_payment_id")
        order_id = data.get("razorpay_order_id")
        signature = data.get("razorpay_signature")

        if not all([booking_id, payment_id, order_id, signature]):
            return Response({"error": "Missing parameters"}, status=400)

        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found"}, status=404)

        if booking.user != request.user:
            return Response({"error": "Not allowed"}, status=403)

        if booking.provider_payment_id != order_id:
            return Response({"error": "Order ID mismatch"}, status=400)

        msg = f"{order_id}|{payment_id}".encode()
        expected_signature = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode(),
            msg,
            hashlib.sha256
        ).hexdigest()

        if not hmac.compare_digest(expected_signature, signature):
            return Response({"error": "Invalid signature"}, status=400)

        booking.payment_status = PaymentStatus.SUCCESS
        booking.provider_payment_id = payment_id
        booking.status = BookingStatus.CONFIRMED
        booking.save()

        notifyMessage(f"Your booking with id {booking.id} has been confirmed",
            getattr(booking.user, "phone_no", None),
        )

        return Response({"status": "ok"})


@method_decorator(csrf_exempt, name="dispatch")
class RazorpayWebhookView(APIView):
    permission_classes = []

    def post(self, request):
        payload = request.body
        signature = request.META.get("HTTP_X_RAZORPAY_SIGNATURE", "")
        webhook_secret = getattr(settings, "RAZORPAY_WEBHOOK_SECRET", "")

        if webhook_secret:
            expected_signature = hmac.new(
                webhook_secret.encode(),
                payload,
                hashlib.sha256
            ).hexdigest()

            if not hmac.compare_digest(expected_signature, signature):
                return Response(status=400)

        try:
            event = json.loads(payload.decode())
        except Exception as e:
            print("[Webhook] Invalid payload:", str(e))
            return Response(status=400)

        order_entity = event.get("payload", {}).get("order", {}).get("entity", {})
        payment_entity = event.get("payload", {}).get("payment", {}).get("entity", {})

        receipt = order_entity.get("receipt")
        payment_status = payment_entity.get("status")
        payment_id = payment_entity.get("id")

        if not receipt or not receipt.startswith("booking_"):
            return Response({"status": "ignored"})

        booking_id = receipt.split("_", 1)[1]

        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            return Response({"status": "booking not found"})

        if booking.payment_status == PaymentStatus.SUCCESS:
            return Response({"status": "already processed"})

        if payment_status in ("captured", "authorized"):
            booking.payment_status = PaymentStatus.SUCCESS
            booking.payment_provider = "RAZORPAY"
            booking.provider_payment_id = payment_id
            booking.status = BookingStatus.CONFIRMED
            booking.save()

        return Response({"status": "ok"})