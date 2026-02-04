from app.models.turf import Turf
from rest_framework import status
from app.models.court import Court
from app.permission import IsOwner
from rest_framework.views import APIView
from rest_framework.response import Response
from app.serializers.court import CourtSerializer
from rest_framework.permissions import IsAuthenticated

class CourtCreateView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def post(self, request):
        serializer = CourtSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        turf_id = request.data.get("turf")
        if not turf_id:
            return Response({"error": "turf is required"},
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

        return Response(CourtSerializer(court).data,
            status=status.HTTP_201_CREATED,
        )
    
class CourtUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]
    
    def patch(self, request, court_id):
        try:
            court = Court.objects.get(id=court_id, turf__business__user=request.user)
        except Court.DoesNotExist:
            return Response({"error": "Court not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = CourtSerializer(court, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        for attr, value in serializer.validated_data.items():
            setattr(court, attr, value)

        court.save()

        return Response(CourtSerializer(court).data,
            status=status.HTTP_200_OK,
        )

class TurfCourtsView(APIView):
    def get(self, request, turf_id):
        if request.user.is_authenticated and request.user.user_type == "OWNER":
            courts = Court.objects.filter(
                turf_id=turf_id,
            )
        else:
            courts = Court.objects.filter(
                turf_id=turf_id,
                is_open=True,
            )


        return Response(CourtSerializer(courts, many=True).data,
            status=status.HTTP_200_OK,
        )

class GetCourtView(APIView):
    def get(self, request, court_id):
        try:
            court = Court.objects.get(id=court_id, is_open=True)
        except Court.DoesNotExist:
            return Response({"error": "Court not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(CourtSerializer(court).data,
            status=status.HTTP_200_OK,
        )