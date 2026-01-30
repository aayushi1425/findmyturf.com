from rest_framework import serializers
from app.models.turf_image import TurfImage

class TurfImageSerializer(serializers.ModelSerializer):
    image_url = serializers.ReadOnlyField(source="image.url")

    class Meta:
        model = TurfImage
        fields = ['id', 'image', 'image_url', 'is_default']
        read_only_fields = ['id', 'image_url']
