from rest_framework import serializers
from .models import BusinessUser

class BusinessUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessUser
        fields = [
            "business_id",
            "business_name",
            "business_email",
            "business_phone",
            "gst_number",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["business_id", "created_at", "updated_at"]


class BusinessRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only = True, min_length=6)
    password_confirm = serializers.CharField(write_only = True, min_length=6)

    class Meta:
        model = BusinessUser
        fields = [
            "business_name",
            "business_email",
            "business_phone",
            "gst_number",
            "password",
            "password_confirm",
        ]

    def validate(self, data):
        if data["password"] != data["password_confirm"]:
            raise serializers.ValidationError({"password": "Passwords do not match"})
        return data

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        password = validated_data.pop("password")
        business_email = validated_data.pop("business_email")
        business_phone = validated_data.pop("business_phone")
        business_user_data = BusinessUser.objects.create_user(
            business_email=business_email,
            business_phone=business_phone,
            password=password,
            **validated_data,
        )
        return business_user_data

class BusinessLoginSerializer(serializers.Serializer):
    business_email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        business_email = data.get("business_email")
        password = data.get("password")

        try:
            business_client = BusinessUser.objects.get(business_email=business_email)
        except BusinessUser.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password")

        if not business_client.check_password(password):
            raise serializers.ValidationError("Invalid email or password")

        if not business_client.is_active:
            raise serializers.ValidationError("This account is inactive")

        data["business_client"] = business_client
        return data
