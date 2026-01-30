from rest_framework import serializers
from datetime import datetime
from app.models.booking import Booking

from app.models.booking import Booking , BookingStatus , PaymentStatus


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = "__all__"
        read_only_fields = [
            "id",
            "custumer",
            "amount",
            "created_at",
            "payment_status",
            "provider_payment_id",
            "payment_provider",
            "status",
        ]

    def validate(self, data):
        start = data["start_time"]
        end = data["end_time"]

        if start >= end:
            raise serializers.ValidationError(
                "End time must be after start time."
            )

        if start < datetime.now().time() or end < datetime.now().time():
            raise serializers.ValidationError(
                "Start & End time must be in the future."
            )
        
        conflict = Booking.objects.filter(
            turf=data["turf"],
            booking_date=data["booking_date"],
            status=BookingStatus.CONFIRMED,
            payment_status=PaymentStatus.SUCCESS,
            start_time__lt=end,
            end_time__gt=start
        ).exists()

        if conflict:
            raise serializers.ValidationError(
                "This time slot is already booked."
            )

        return data

    def create(self, validated_data):
        turf = validated_data["turf"]
        start = validated_data["start_time"]
        end = validated_data["end_time"]

        start_dt = datetime.combine(datetime.today(), start)
        end_dt = datetime.combine(datetime.today(), end)

        duration_hours = (
            end_dt - start_dt
        ).total_seconds() / 3600

        validated_data["amount"] = int(
            duration_hours * turf.price
        )

        return super().create(validated_data)

class OwnerBookingSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source="custumer.name")
    customer_phone = serializers.ReadOnlyField(source="custumer.phone_no")

    class Meta:
        model = Booking
        fields = [
            "id",
            "booking_date",
            "start_time",
            "end_time",
            "amount",
            "status",
            "payment_status",
            "customer_name",
            "customer_phone",
            "created_at"
        ]

class BookingDetailSerializer(serializers.ModelSerializer):
    turf_name = serializers.ReadOnlyField(source="turf.name")
    turf_city = serializers.ReadOnlyField(source="turf.city")

    class Meta:
        model = Booking
        fields = "__all__"
