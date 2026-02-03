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
            "created_at",
            "updated_at",
        ]


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