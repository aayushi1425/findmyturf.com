from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from app.models.booking import Booking, BookingStatus, PaymentStatus
from app.permission import IsOwner

class ConfirmPaymentView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def post(self, request, booking_id):
        booking = Booking.objects.get(
            id=booking_id,
            custumer=request.user
        )

        booking.payment_status = PaymentStatus.SUCCESS
        booking.payment_provider = "RAZORPAY"
        booking.provider_payment_id = "FAKE_PAYMENT_ID"

        booking.status = BookingStatus.CONFIRMED
        booking.save()

        return Response({"msg": "Payment successful, booking confirmed"})
