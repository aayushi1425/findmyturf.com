from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import Slot
from .serializers import SlotSerializer


class SlotListAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        turf_id = request.query_params.get("turf_id")
        slot_date = request.query_params.get("date")

        if not turf_id:
            return Response(
                {"message": "turf_id query parameter is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        queryset = Slot.objects.filter(turf_id=turf_id).order_by("slot_date", "start_time")

        if slot_date:
            queryset = queryset.filter(slot_date=slot_date)

        serializer = SlotSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

