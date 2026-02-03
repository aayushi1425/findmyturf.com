from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from app.models.court import Court
from app.models.turf import Turf
from app.serializers.court import CourtSerializer
from app.permission import IsOwner


class CourtCreateView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def post(self, request):
        serializer = CourtSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        turf_id = request.data.get("turf")

        if not turf_id:
            return Response(
                {"error": "turf is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            turf = Turf.objects.get(
                id=turf_id,
                business__user=request.user,
            )
        except Turf.DoesNotExist:
            return Response({"error": "Turf not found or not owned by you"},
                status=status.HTTP_404_NOT_FOUND,
            )

        court = Court.objects.create(
            turf=turf,
            sports_type=serializer.validated_data["sports_type"],
            price=serializer.validated_data["price"],
            length=serializer.validated_data["length"],
            width=serializer.validated_data["width"],
            height=serializer.validated_data["height"],
            is_open=serializer.validated_data.get("is_open", True),
        )

        return Response(
            CourtSerializer(court).data,
            status=status.HTTP_201_CREATED,
        )
class TurfCourtsView(APIView):
    def get(self, request, turf_id):
        courts = Court.objects.filter(
            turf_id=turf_id,
            is_open=True,
        )

        return Response(
            CourtSerializer(courts, many=True).data,
            status=status.HTTP_200_OK,
        )

