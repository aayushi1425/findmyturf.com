from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import AccessToken

from .serializers import UserRegisterSerializer, UserLoginSerializer
from typing import cast

class UserRegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        serializer = cast(UserRegisterSerializer, serializer)

        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        return Response(
            {
                "message": "User registered successfully",
                "user_id": user.user_id
            },
            status=status.HTTP_201_CREATED
        )



class UserLoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)

        # 🔒 type narrowing for Pylance
        serializer = cast(UserLoginSerializer, serializer)

        serializer.is_valid(raise_exception=True)

        user = serializer.user

        access_token = str(AccessToken.for_user(user))

        return Response(
            {
                "access": access_token,
                "user": {
                    "user_id": user.user_id,
                    "name": user.name,
                    "phone_no": user.phone_no,
                    "email": user.email,
                }
            },
            status=status.HTTP_200_OK
        )
