from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from app.serializers.auth import UserRegisterSerializer, OwnerRegisterSerializer

class UserRegisterView(APIView):
    def post(self, request):
        s = UserRegisterSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        s.save()
        return Response({"msg": "User registered"}, status=201)


class OwnerRegisterView(APIView):
    def post(self, request):
        s = OwnerRegisterSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        s.save()
        return Response({"msg": "Owner registered"}, status=201)
