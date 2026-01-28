# from .models import User
# from typing import Optional, cast
# from rest_framework import serializers
# from django.contrib.auth import authenticate

# class UserRegisterSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(
#         write_only=True,
#         min_length=8,
#         style={"input_type": "password"}
#     )

#     class Meta:
#         model = User
#         fields = [
#             "name",
#             "phone_no",
#             "password"
#         ]
#         read_only_fields = ["user_id"]

#     def validate_email(self, value):
#         if value and User.objects.filter(email=value).exists():
#             raise serializers.ValidationError("Email already registered")
#         return value

#     def validate_phone_no(self, value):
#         if User.objects.filter(phone_no=value).exists():
#             raise serializers.ValidationError("Phone number already registered")
#         return value

#     def create(self, validated_data):
#         password = validated_data.pop("password")
#         user = User(**validated_data)
#         user.set_password(password)
#         user.save()
#         return user

# class UserLoginSerializer(serializers.Serializer):
#     phone_no = serializers.CharField(required=False)
#     email = serializers.EmailField(required=False)
#     password = serializers.CharField(write_only=True)

#     _user: Optional[User] = None
    
#     class Meta:
#         model = User
#         fields = ["phone_no", "password"]
    
#     def validate(self, data):
#         phone_no = data["phone_no"]
#         password = data["password"]
#         if not phone_no:
#             raise serializers.ValidationError(
#                 "Either phone number or email is required"
#             )

#         auth_user = User.objects.get(phone_no=phone_no)

#         if not auth_user.check_password(password):
#             raise serializers.ValidationError("Invalid credentials")
        
#         return auth_user


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
