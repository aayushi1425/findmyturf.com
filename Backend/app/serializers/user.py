from rest_framework import serializers
from app.models.user import User

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "name",
            "phone_no",
            "password",
            "user_type",
        ]
        read_only_fields = [
            "id",
            "user_type",
        ]