from rest_framework import serializers
from app.models.booking import Booking

class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            "court",
            "booking_date",
            "start_time",
            "end_time",
        ]

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = "__all__"
        read_only_fields = [
            "id",
            "user",
            "amount",
            "status",
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

        # if start < datetime.now().time() or end < datetime.now().time():
        #     raise serializers.ValidationError(
        #         "Start & End time must be in the future."
        #     )
        
        conflict = Booking.objects.filter(
            turf=data["turf"],
            booking_date=data["booking_date"],
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
    customer_name = serializers.ReadOnlyField(source="user.name")
    customer_phone = serializers.ReadOnlyField(source="user.phone_no")
    court_id = serializers.ReadOnlyField(source="court.id")
    sport_type = serializers.ReadOnlyField(source="court.sports_type")

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
            "sport_type",
            "court_id",
            "created_at",
        ]


class BookingDetailSerializer(serializers.ModelSerializer):
    court_id = serializers.ReadOnlyField(source="court.id")
    turf_name = serializers.ReadOnlyField(source="court.turf.name")
    turf_city = serializers.ReadOnlyField(source="court.turf.city")
    sport_type = serializers.ReadOnlyField(source="court.sports_type")

    class Meta:
        model = Booking
        fields = "__all__"