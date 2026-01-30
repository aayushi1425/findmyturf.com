from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from app.serializers.booking import BookingSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from app.models.booking import BookingStatus, PaymentStatus
from app.models.booking import Booking
from app.utils.notify import notifyMessage
from rest_framework import status
from app.serializers.booking import BookingDetailSerializer

class BookingCreateView(CreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(custumer=self.request.user)


class MyBookingsView(ListAPIView):
    serializer_class = BookingSerializer

    def get_queryset(self):
        return Booking.objects.filter(custumer=self.request.user)


class CancelBookingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, booking_id):
        booking = Booking.objects.get(
            id=booking_id
        )

        if booking.status != BookingStatus.CONFIRMED:
            return Response({"error": "Only confirmed bookings can be cancelled"},
                status=400
            )
        
        if str(request.user.id) not in [str(booking.turf.business.user.id) , str(booking.custumer.id)]:
            return Response({"error": "You can only cancel your own bookings"},
                status=400
            )

        booking.status = BookingStatus.CANCELLED
        booking.payment_status = PaymentStatus.REFUNDED
        booking.save()

        notifyMessage(
            f"Your booking with id {booking_id} has been cancelled", 
            booking.custumer.phone_no
        )
        return Response({
            "msg": "Booking cancelled and refund processed"
        })

class BookingDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, booking_id):
        try:
            booking = Booking.objects.get(
                id = booking_id,
                custumer = request.user
            )
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found"},
                status = status.HTTP_404_NOT_FOUND
            )

        serializer = BookingDetailSerializer(booking)
        return Response(serializer.data)
