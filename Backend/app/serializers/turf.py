from rest_framework import serializers
from app.models.turf import Turf
from app.serializers.turf_image import TurfImageSerializer
from app.serializers.court import CourtSerializer

class TurfSerializer(serializers.ModelSerializer):
    images = TurfImageSerializer(many=True, read_only=True)
    courts = CourtSerializer(many=True, read_only=True)
    default_image = serializers.CharField(read_only=True)

    class Meta:
        model = Turf
        fields = "__all__"
        read_only_fields = [
            "id",
            "business",
            "created_at",
            "updated_at",
        ]