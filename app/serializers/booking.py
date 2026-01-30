from rest_framework import serializers
from datetime import datetime, timedelta
from app.models.booking import Booking

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ['id', 'custumer', 'amount', 'created_at']

    def validate(self, data):
        start = data['start_time']
        end = data['end_time']

        if start >= end:
            raise serializers.ValidationError(
                "End time must be after start time."
            )

        if start < datetime.now().time() or end < datetime.now().time():
            raise serializers.ValidationError(
                "Start & End time must be in the future."
            )
        
        conflict = Booking.objects.filter(
            turf=data['turf'],
            booking_date=data['booking_date'],
            start_time__lt=end,
            end_time__gt=start
        ).exists()

        if conflict:
            raise serializers.ValidationError(
                "This time slot is already booked."
            )

        return data

    def create(self, validated_data):
        turf = validated_data['turf']
        start = validated_data['start_time']
        end = validated_data['end_time']

        start_dt = datetime.combine(datetime.today(), start)
        end_dt = datetime.combine(datetime.today(), end)
        duration_hours = (end_dt - start_dt).total_seconds() / 3600
        amount = int(duration_hours * turf.price)

        validated_data['amount'] = amount

        return super().create(validated_data)
