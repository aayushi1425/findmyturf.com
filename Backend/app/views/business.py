from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from app.models.business import Business
from app.serializers.business import BusinessSerializer
from app.permission import IsOwner


class BusinessCreateView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def post(self, request):
        serializer = BusinessSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if Business.objects.filter(user=request.user).exists():
            return Response({"error": "Business already exists for this user"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        business = Business.objects.create(
            user=request.user,
            name=serializer.validated_data.get("name"),
            gstno=serializer.validated_data.get("gstno"),
        )

        return Response(
            BusinessSerializer(business).data,
            status=status.HTTP_201_CREATED,
        )
