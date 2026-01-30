from rest_framework.generics import CreateAPIView, ListAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from app.serializers.booking import BookingSerializer
from app.models.booking import Booking

class BookingCreateView(CreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(custumer=self.request.user)


class MyBookingsView(ListAPIView):
    serializer_class = BookingSerializer

    def get_queryset(self):
        return Booking.objects.filter(custumer=self.request.user)


from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from app.models.booking import Booking, BookingStatus, PaymentStatus

class CancelBookingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, booking_id):
        booking = Booking.objects.get(
            id=booking_id,
            custumer=request.user
        )

        if booking.status != BookingStatus.CONFIRMED:
            return Response(
                {"error": "Only confirmed bookings can be cancelled"},
                status=400
            )

        booking.status = BookingStatus.CANCELLED
        booking.payment_status = PaymentStatus.REFUNDED
        booking.save()

        booking.status = BookingStatus.REFUNDED
        booking.save()

        return Response({
            "msg": "Booking cancelled and refund processed"
        })
