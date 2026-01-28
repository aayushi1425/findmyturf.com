from typing import Optional, cast
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["name", "phone_no", "password"]

    def validate_phone_no(self, value):
        if User.objects.filter(phone_no=value).exists():
            raise serializers.ValidationError("Phone number already registered")
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserLoginSerializer(serializers.Serializer):
    phone_no = serializers.CharField()
    password = serializers.CharField(write_only=True)

    _user: Optional[User] = None

    def validate(self, data):
        phone_no = data.get("phone_no")
        password = data.get("password")

        try:
            user = User.objects.get(phone_no=phone_no)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid credentials")

        if not user.check_password(password):
            raise serializers.ValidationError("Invalid credentials")

        self._user = user
        return data

    @property
    def user(self) -> User:
        assert self._user is not None
        return self._user
