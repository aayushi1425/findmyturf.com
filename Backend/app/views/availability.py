from datetime import datetime
from django.utils import timezone
from rest_framework import status
from app.models.court import Court
from rest_framework.views import APIView
from rest_framework.response import Response
from app.utils.slots import generate_hour_slots
from app.models.booking import Booking, BookingStatus

class CourtAvailableSlotsView(APIView):
    def get(self, request, court_id):
        date_str = request.query_params.get("date")
        if not date_str:
            return Response({"error": "date query param is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            booking_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            court = Court.objects.select_related("turf").get(id=court_id)
        except Court.DoesNotExist:
            return Response({"error": "Court not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        
        all_slots = generate_hour_slots(
            court.turf.opening_time,
            court.turf.closing_time,
        )

        bookings = Booking.objects.filter(
            court=court,
            booking_date=booking_date
        )

        available_slots = []
        for slot in all_slots:
            slot_start = slot["start_time"]
            slot_end = slot["end_time"]

            conflict = bookings.filter(
                start_time__lt=slot_end,
                end_time__gt=slot_start,
                status=BookingStatus.CONFIRMED,
            ).exists()

            if not conflict:
                available_slots.append({
                        "start_time": slot_start.strftime("%H:%M"),
                        "end_time": slot_end.strftime("%H:%M"),
                    }
                )

        today = timezone.localdate()

        if booking_date < today:
            available_slots = []

        elif booking_date == today:
            now = timezone.localtime()
            filtered = []

            for slot in available_slots:
                slot_start_time = datetime.strptime(slot["start_time"], "%H:%M").time()

                slot_start_dt = timezone.make_aware(
                    datetime.combine(booking_date, slot_start_time)
                )

                if slot_start_dt > now:
                    filtered.append(slot)

            available_slots = filtered

        return Response({
                "court_id": str(court.id),
                "turf_id": str(court.turf.id),
                "sport_type": court.sports_type,
                "date": booking_date,
                "available_slots": available_slots,
            }
        )