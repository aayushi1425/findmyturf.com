from rest_framework import serializers
from app.models.turf import Turf
from app.serializers.turf_image import TurfImageSerializer

class TurfSerializer(serializers.ModelSerializer):
    images = TurfImageSerializer(many=True, read_only=True)
    default_image = serializers.SerializerMethodField()

    class Meta:
        model = Turf
        fields = '__all__'
        read_only_fields = ['id', 'business', 'created_at']

    def get_default_image(self, obj):
        default = obj.images.filter(is_default=True).first()
        return default.image.url if default else None
