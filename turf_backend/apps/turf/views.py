from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404

from .models import Turf
from .serializers import TurfSerializer
from apps.business.models import BusinessUser


class TurfListCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        turfs = Turf.objects.filter(is_open=True)
        serializer = TurfSerializer(turfs, many=True)
        return Response(serializer.data)

    def post(self, request):
        try:
            business = BusinessUser.objects.get(user=request.user)
        except BusinessUser.DoesNotExist:
            return Response(
                {"detail": "Business profile not found"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = TurfSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner = business)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TurfDetailAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, turf_id):
        turf = get_object_or_404(Turf, id=turf_id)
        serializer = TurfSerializer(turf)
        return Response(serializer.data)

    def patch(self, request, turf_id):
        turf = get_object_or_404(Turf, id=turf_id)

        if turf.owner.user != request.user:
            return Response(
                {"detail": "Not allowed"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = TurfSerializer(
            turf,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TurfStatusAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, turf_id):
        turf = get_object_or_404(Turf, id=turf_id)
        return Response({"is_open": turf.is_open})