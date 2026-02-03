from rest_framework import serializers
from app.models.user import User

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "name",
            "phone_no",
            "password",
        ]

class OwnerRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    business_name = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "name",
            "phone_no",
            "password",
            "business_name",
        ]