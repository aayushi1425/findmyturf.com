from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from app.models.user import User, UserType
from app.models.business import Business
from app.serializers.auth import  UserRegisterSerializer, OwnerRegisterSerializer

class UserRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        User.objects.create_user(
            phone_no=data["phone_no"],
            password=data["password"],
            name=data.get("name"),
            user_type=UserType.USER.value,
        )

        return Response(
            {"message": "User registered successfully"},
            status=status.HTTP_201_CREATED,
        )


class OwnerRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OwnerRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        user = User.objects.create_user(
            phone_no=data["phone_no"],
            password=data["password"],
            name=data.get("name"),
            user_type=UserType.OWNER.value,
        )

        Business.objects.create(
            user=user,
            name=data["business_name"],
        )

        return Response(
            {"message": "Owner registered successfully"},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        phone_no = request.data.get("phone_no")
        password = request.data.get("password")

        if not phone_no or not password:
            return Response(
                {"detail": "Phone number and password are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(phone_no=phone_no, password=password)

        if not user:
            return Response(
                {"detail": "Invalid credentials"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "role": user.user_type,
            },
            status=status.HTTP_200_OK,
        )
