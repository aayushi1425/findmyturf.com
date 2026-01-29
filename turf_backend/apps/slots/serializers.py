from rest_framework import serializers
from .models import Slot

class SlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slot
        fields = [
            "slot_id",
            "slot_date",
            "start_time",
            "end_time",
            "is_available",
        ]
        
class SlotAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Slot
        fields = [
            "is_available",
        ]
        
        def validate(self, data):
            if "is_available" not in data:
                raise serializers.ValidationError("is_available field is required.")
            return data