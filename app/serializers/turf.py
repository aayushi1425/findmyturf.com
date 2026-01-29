from rest_framework import serializers
from app.models.turf import Turf

class TurfSerializer(serializers.ModelSerializer):
    dimensions = serializers.ReadOnlyField(source='dimensions_display')

    class Meta:
        model = Turf
        fields = '__all__'
        read_only_fields = ['id', 'business', 'created_at']
