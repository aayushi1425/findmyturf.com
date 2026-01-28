from rest_framework import serializers
from .models import BusinessUser

class BusinessRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessUser
        fields = [
            "id",
            "user",
            "business_name",
            "tenant_domain",
            "gst_number",
        ]
        read_only_fields = ["id"]

    def validate_tenant_domain(self, value):
        return value.lower()

    def create(self, validated_data):
        return BusinessUser.objects.create(**validated_data)
