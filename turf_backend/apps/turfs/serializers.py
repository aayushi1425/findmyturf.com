from rest_framework import serializers
from .models import Turfs, TurfImage


class TurfsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Turfs
        fields = "__all__"
        read_only_fields = ("id" , "owner" , "created_at" , "updated_at")

class TurfImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TurfImage
        fields = [
            "id",
            "turf",
            "image_url",
            "priority",
            "created_at"
        ]
        read_only_fields = ["id", "turf", "created_at"]

