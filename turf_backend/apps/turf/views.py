from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Turf
from .serializers import TurfSerializer


class TurfListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        turfs = Turf.objects.filter(is_open=True)
        serializer = TurfSerializer(turfs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TurfSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TurfDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, turf_id):
        try:
            return Turf.objects.get(turf_id=turf_id)
        except Turf.DoesNotExist:
            return None

    def get(self, request, turf_id):
        turf = self.get_object(turf_id)
        if not turf:
            return Response({"error": "Turf not found"}, status=404)

        serializer = TurfSerializer(turf)
        return Response(serializer.data)

    def patch(self, request, turf_id):
        turf = self.get_object(turf_id)
        if not turf:
            return Response({"error": "Turf not found"}, status=404)

        if turf.owner != request.user:
            return Response({"error": "Unauthorized"}, status=403)

        serializer = TurfSerializer(turf, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)


class TurfStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, turf_id):
        try:
            turf = Turf.objects.get(turf_id=turf_id)
        except Turf.DoesNotExist:
            return Response({"error": "Turf not found"}, status=404)

        if turf.owner != request.user:
            return Response({"error": "Unauthorized"}, status=403)

        is_open = request.data.get("is_open")
        if is_open is None:
            return Response(
                {"error": "is_open field required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        turf.is_open = is_open
        turf.save()

        return Response(
            {"message": "Turf status updated", "is_open": turf.is_open}
        )
