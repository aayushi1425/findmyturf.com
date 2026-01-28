from rest_framework import serializers
from .models import Turf, TurfImage


class TurfImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TurfImage
        fields = ["image_id", "image", "is_primary", "created_at"]
        read_only_fields = ["image_id", "created_at"]


class TurfSerializer(serializers.ModelSerializer):
    images = TurfImageSerializer(many=True, read_only=True)

    class Meta:
        model = Turf
        fields = [
            "turf_id",
            "owner",
            "name",
            "description",
            "sports_type",
            "location",
            "city",
            "state",
            "pincode",
            "latitude",
            "longitude",
            "dimension",
            "is_open",
            "created_at",
            "updated_at",
            "images",
        ]
        read_only_fields = [
            "turf_id",
            "owner",
            "created_at",
            "updated_at",
        ]
