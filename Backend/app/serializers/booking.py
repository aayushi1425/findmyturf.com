from rest_framework import serializers
from app.models.booking import Booking

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

class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            "court",
            "booking_date",
            "start_time",
            "end_time",
        ]

class BookingDetailSerializer(serializers.ModelSerializer):
    turf_name = serializers.CharField(source="court.turf.name", read_only=True)
    turf_location = serializers.CharField(source="court.turf.location", read_only=True)
    turf_city = serializers.CharField(source="court.turf.city", read_only=True)
    turf_state = serializers.CharField(source="court.turf.state", read_only=True)
    court_sport = serializers.CharField(source="court.sports_type", read_only=True)
    turf_location = serializers.CharField(source="court.turf.location", read_only=True)
    length = serializers.CharField(source="court.length", read_only=True)
    width = serializers.CharField(source="court.width", read_only=True)
    height = serializers.CharField(source="court.height", read_only=True)
    turf_latitude = serializers.CharField(source="court.turf.latitude", read_only=True)
    turf_longitude = serializers.CharField(source="court.turf.longitude", read_only=True)

    class Meta:
        model = Booking
        fields = "__all__"

class OwnerBookingSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source="user.name", read_only=True)
    customer_phone = serializers.CharField(source="user.phone_no", read_only=True)
    court_sport = serializers.CharField(source="court.sports_type", read_only=True)

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
            "court_sport",
            "customer_name",
            "customer_phone",
            "created_at",
        ]
