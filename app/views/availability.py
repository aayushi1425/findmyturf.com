from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime

from app.models.turf import Turf
from app.models.booking import Booking, BookingStatus, PaymentStatus
from app.utils.slots import generate_hour_slots


class TurfAvailableSlotsView(APIView):
    def get(self, request, turf_id):
        date_str = request.query_params.get("date")

        if not date_str:
            return Response(
                {"error": "date query param is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        booking_date = datetime.strptime(date_str, "%Y-%m-%d").date()

        turf = Turf.objects.get(id=turf_id)

        all_slots = generate_hour_slots(
            turf.opening_time,
            turf.closing_time
        )

        # Only confirmed + paid bookings block slots
        bookings = Booking.objects.filter(
            turf=turf,
            booking_date=booking_date,
            status=BookingStatus.CONFIRMED,
            payment_status=PaymentStatus.SUCCESS
        )

        available_slots = []

        for slot in all_slots:
            slot_start = slot["start_time"]
            slot_end = slot["end_time"]

            conflict = bookings.filter(
                start_time__lt=slot_end,
                end_time__gt=slot_start
            ).exists()

            if not conflict:
                available_slots.append({
                    "start_time": slot_start.strftime("%H:%M"),
                    "end_time": slot_end.strftime("%H:%M"),
                })

        return Response({
            "turf_id": str(turf.id),
            "date": booking_date,
            "available_slots": available_slots,
        })
