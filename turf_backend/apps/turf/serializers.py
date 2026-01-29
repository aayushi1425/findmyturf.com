from rest_framework import serializers
from .models import Turf

class TurfSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Turf
        fields = "__all__"
        read_only_fields = [
            "id",
            "owner",
            "created_at",
            "updated_at"
        ]