from .models import Booking
from rest_framework import serializers
from apps.slots.serializers import SlotSerializer

class BookingSerializer(serializers.ModelSerializer):
    slot = SlotSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = ["id", "slot", "amount", "status", "created_at"]


class OwnerBookingSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.name", read_only=True)
    user_phone = serializers.CharField(source="user.phone_no", read_only=True)
    slot_date = serializers.DateField(source="slot.slot_date", read_only=True)
    start_time = serializers.TimeField(source="slot.start_time", read_only=True)
    end_time = serializers.TimeField(source="slot.end_time", read_only=True)
    turf_name = serializers.CharField(source="slot.turf.name", read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id" , "turf_name" , "amount" , "status" , "created_at" , 
            "user_name" , "user_phone" , "slot_date" , "start_time" , "end_time",
        ]