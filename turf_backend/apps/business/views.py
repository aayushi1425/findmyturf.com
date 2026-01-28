from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from .models import BusinessUser
from .serializers import BusinessRegisterSerializer

class BusinessRegister(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data.copy()
        data["user"] = request.user.id

        serializer = BusinessRegisterSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Business registered successfully", "data": serializer.data},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BusinessProfile(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            business = BusinessUser.objects.get(pk=pk, user=request.user)
        except BusinessUser.DoesNotExist:
            return Response(
                {"detail": "Business profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = BusinessRegisterSerializer(business)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        try:
            business = BusinessUser.objects.get(pk=pk, user=request.user)
        except BusinessUser.DoesNotExist:
            return Response({"detail": "Business profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = BusinessRegisterSerializer(business , data=request.data , partial = True)

        if serializer.is_valid():
            serializer.save()
            return Response({
                    "message": "Business profile updated successfully",
                    "data": serializer.data
                },
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
