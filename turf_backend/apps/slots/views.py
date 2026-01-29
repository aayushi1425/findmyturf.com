from datetime import datetime
from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.turfs.models import Turfs
from .models import Slot
from .serializers import SlotSerializer, SlotAvailabilitySerializer
from .services import generate_slots_for_date


class TurfSlotsAPIView(APIView):
    """
    GET /api/turfs/{turf_id}/slots/?date=YYYY-MM-DD
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, turf_id):
        date_str = request.query_params.get("date")
        if not date_str:
            return Response({"error": "date query param is required"}, status=400)

        slot_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        turf = get_object_or_404(Turfs, id=turf_id)

        generate_slots_for_date(turf, slot_date)

        slots = Slot.objects.filter(
            turf=turf,
            slot_date=slot_date,
            is_available=True
        ).order_by("start_time")

        serializer = SlotSerializer(slots, many=True)
        return Response(serializer.data)


class SlotAvailabilityAPIView(APIView):
    """
    PATCH /api/slots/{slot_id}/
    Business blocks or unblocks slot
    """
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def patch(self, request, slot_id):
        slot = Slot.objects.select_for_update().get(id=slot_id)

        serializer = SlotAvailabilitySerializer(
            slot,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({"message": "Slot updated successfully"})
