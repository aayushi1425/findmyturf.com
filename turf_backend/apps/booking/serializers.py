from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ["id", "slot", "amount", "status", "created_at"]
        read_only_fields = ["id", "amount", "status", "created_at", "slot"]
