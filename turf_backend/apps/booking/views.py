from .models import Booking
from rest_framework import status
from django.db import transaction
from apps.slots.models import Slot
from apps.turfs.models import Turfs
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import BookingSerializer, OwnerBookingSerializer

from .utils import calculate_amount, is_slot_overlapping

class OwnerBookingsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        bookings = Booking.objects.filter(slot__turf__owner = request.user).select_related(
            "user",
            "slot",
            "slot__turf"
        ).order_by("-created_at")

        serializer = OwnerBookingSerializer(bookings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class BookingAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        turf_id = request.data.get("turf")
        slot_date = request.data.get("date")
        start_time = request.data.get("start_time")
        end_time = request.data.get("end_time")

        if not all([turf_id, slot_date, start_time, end_time]):
            return Response({"message": "turf, date, start_time, end_time are required"},
                status = status.HTTP_400_BAD_REQUEST
            )

        turf = get_object_or_404(Turfs, id=turf_id, is_open=True)

        if is_slot_overlapping(turf, slot_date, start_time, end_time):
            return Response({"message": "This time slot overlaps with an existing booking"},
                status=status.HTTP_400_BAD_REQUEST
            )

        amount = calculate_amount(start_time = start_time ,
            end_time = end_time ,
            price_per_hour = turf.price
        )

        with transaction.atomic():
            slot = Slot.objects.create(turf = turf ,
                slot_date = slot_date,
                start_time = start_time,
                end_time = end_time,
                is_available = False
            )

            booking = Booking.objects.create(
                user=request.user,
                slot=slot,
                amount=amount
            )

        return Response({
                "message": "Booking created successfully",
                "data": BookingSerializer(booking).data
            },
            status=status.HTTP_201_CREATED
        )

    def get(self, request):
        bookings = Booking.objects.filter(user=request.user).select_related("slot", "slot__turf")
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class BookingDetailAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, booking_id):
        booking = (
            Booking.objects.filter(id=booking_id)
            .select_related("slot", "slot__turf")
            .first()
        )
        
        if not booking:
            return Response({"message": "Booking not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(BookingSerializer(booking).data,
            status=status.HTTP_200_OK
        )
