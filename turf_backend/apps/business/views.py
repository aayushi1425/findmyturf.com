from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import BusinessRegisterSerializer, BusinessLoginSerializer


class BusinessRegister(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = BusinessRegisterSerializer(data=request.data)
        if serializer.is_valid():
            business_client = serializer.save()
            refresh = RefreshToken.for_user(business_client)
            
            response_data = {
                "message": "Business registered successfully",
                "tokens": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
                "business": {
                    "id": str(business_client.business_id),
                    "email": business_client.business_email,
                    "name": business_client.business_name,
                    "phone": business_client.business_phone,
                    "gst_number": business_client.gst_number,
                    "created_at": business_client.created_at,
                }
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BusinessLogin(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = BusinessLoginSerializer(data=request.data)
        if serializer.is_valid():
            business_client = serializer.validated_data["business_client"]
            refresh = RefreshToken.for_user(business_client)
            
            response_data = {
                "message": "Login successful",
                "tokens": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
                "business": {
                    "id": str(business_client.business_id),
                    "email": business_client.business_email,
                    "name": business_client.business_name,
                    "phone": business_client.business_phone,
                    "gst_number": business_client.gst_number,
                    "created_at": business_client.created_at,
                }
            }
            return Response(response_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)