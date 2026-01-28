from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny , IsAuthenticated
from rest_framework_simplejwt.tokens import AccessToken
from apps.business.models import BusinessUser
from apps.business.serializers import BusinessRegisterSerializer
from .serializers import UserRegisterSerializer, UserLoginSerializer , UserSerializer

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

class UpdateUserProfile(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def patch(self, request):
        user = request.user
        serializer = UserRegisterSerializer(user, data = request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User profile updated successfully", "data": serializer.data},
                status = status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ListUserBusiness(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        business = BusinessUser.objects.filter(user = user)
        serializer = BusinessRegisterSerializer(business, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    