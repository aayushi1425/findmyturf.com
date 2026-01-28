from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import AccessToken
from .serializers import UserRegisterSerializer, UserLoginSerializer

class UserRegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            access_token = str(AccessToken.for_user(serializer.user))
            return Response({
                "id": serializer.user.id,
                "message": "User registered successfully",
                "token": access_token 
            },
            status=status.HTTP_201_CREATED
        )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        access_token = str(AccessToken.for_user(serializer.user))
        return Response({
            "id": serializer.user.id ,
            "message": "Login successful" ,
            "token": access_token
        }, status=status.HTTP_200_OK)