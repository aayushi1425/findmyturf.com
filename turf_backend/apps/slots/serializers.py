from rest_framework import serializers
from .models import Slot

from apps.turfs.serializers import TurfsSerializer

class SlotSerializer(serializers.ModelSerializer):
    turf = TurfsSerializer(read_only=True)

    class Meta:
        model = Slot
        fields = ["id" , "slot_date" , "start_time" , "end_time" , "is_available" , "turf"]
