from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from app.models.booking import Booking, BookingStatus, PaymentStatus
from app.permission import IsOwner
from app.utils.notify import notifyMessage

class ConfirmPaymentView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def post(self, request, booking_id):
        booking = Booking.objects.get(
            id=booking_id
        )

        booking.payment_status = PaymentStatus.SUCCESS
        booking.payment_provider = "RAZORPAY"
        booking.provider_payment_id = "FAKE_PAYMENT_ID"

        booking.status = BookingStatus.CONFIRMED
        booking.save()

        notifyMessage(
            f"Your booking with id {booking_id} has been confirmed", 
            booking.custumer.phone_no
        )
        notifyMessage(
            f"The booking with id {booking_id} has been confirmed for {booking.turf.business.name} at {booking.booking_date} from {booking.start_time} to {booking.end_time}", 
            booking.turf.business.user.phone_no
        )

        return Response({"msg": "Payment successful, booking confirmed"})
