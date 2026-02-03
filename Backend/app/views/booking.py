from datetime import datetime

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from app.models.court import Court
from app.utils.notify import notifyMessage
from app.models.booking import Booking, BookingStatus, PaymentStatus
from app.serializers.booking import BookingCreateSerializer , BookingSerializer, BookingDetailSerializer


class BookingCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = BookingCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        user = request.user

        court = Court.objects.get(id=data["court"])

        start = data["start_time"]
        end = data["end_time"]
        booking_date = data["booking_date"]

        if start >= end:
            return Response(
                {"error": "End time must be after start time"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        conflict = Booking.objects.filter(
            court=court,
            booking_date=booking_date,
            start_time__lt=end,
            end_time__gt=start,
            status__in=[BookingStatus.PENDING, BookingStatus.CONFIRMED],
        ).exists()

        if conflict:
            return Response(
                {"error": "This slot is already booked"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        start_dt = datetime.combine(booking_date, start)
        end_dt = datetime.combine(booking_date, end)
        hours = (end_dt - start_dt).total_seconds() / 3600
        amount = int(hours * court.price)

        booking = Booking.objects.create(
            user=user,
            court=court,
            booking_date=booking_date,
            start_time=start,
            end_time=end,
            amount=amount,
            status=BookingStatus.PENDING,
            payment_status=PaymentStatus.INITIATED,
        )

        return Response(
            BookingSerializer(booking).data,
            status=status.HTTP_201_CREATED,
        )


class MyBookingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bookings = Booking.objects.filter(user=request.user).order_by("-created_at")

        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)


class BookingDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, booking_id):
        try:
            booking = Booking.objects.get(
                id=booking_id,
                user=request.user,
            )
        except Booking.DoesNotExist:
            return Response(
                {"error": "Booking not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = BookingDetailSerializer(booking)
        return Response(serializer.data)


class CancelBookingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, booking_id):
        try:
            booking = Booking.objects.select_related("court__turf__business__user").get(
                id=booking_id
            )
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        user = request.user
        is_owner = booking.court.turf.business.user == user
        is_customer = booking.user == user

        if not (is_owner or is_customer):
            return Response(
                {"error": "You are not allowed to cancel this booking"},
                status=status.HTTP_403_FORBIDDEN,
            )

        if booking.status in [BookingStatus.CANCELLED, BookingStatus.REFUNDED]:
            return Response(
                {"error": "Booking already cancelled"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        booking.status = BookingStatus.CANCELLED
        if booking.payment_status == PaymentStatus.SUCCESS:
            booking.payment_status = PaymentStatus.REFUNDED

        booking.save()

        notifyMessage(f"Your booking ({booking.id}) has been cancelled",
            booking.user.phone_no,
        )

        return Response({"message": "Booking cancelled successfully"},
            status=status.HTTP_200_OK,
        )