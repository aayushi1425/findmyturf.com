from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from app.models.booking import Booking
from rest_framework import status
from app.serializers.booking import OwnerBookingSerializer
from app.models.turf import Turf
from app.serializers.turf import TurfSerializer
from app.permission import IsOwner


class OwnerTurfsView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def get(self, request):
        turfs = Turf.objects.filter(
            business__user=request.user
        )

        serializer = TurfSerializer(turfs, many=True)
        return Response(serializer.data)

class OwnerTurfBookingsView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def get(self, request, turf_id):
        try:
            turf = Turf.objects.get(
                id=turf_id,
                business__user=request.user
            )
        except Turf.DoesNotExist:
            return Response(
                {"error": "Turf not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        bookings = Booking.objects.filter(
            turf=turf
        ).order_by("-booking_date", "-start_time")

        serializer = OwnerBookingSerializer(bookings, many=True)
        return Response(serializer.data)
