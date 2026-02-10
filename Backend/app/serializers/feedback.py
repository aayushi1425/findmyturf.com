from rest_framework import serializers
from app.models.feedback import Feedback

class FeedbackSerializer(serializers.ModelSerializer):
    turf_name = serializers.CharField(source="turf.name", read_only=True)
    user_name = serializers.CharField(source="user.name", read_only=True)
    user_phone = serializers.CharField(source="user.phone_no", read_only=True)

    class Meta:
        model = Feedback
        fields = [
            "id",
            "booking",
            "turf",
            "user",
            "user_name",
            "user_phone",
            "turf_name",
            "rating",
            "comment",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "user",
            "turf",
            "created_at",
            "updated_at",
        ]

class FeedbackCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = [
            "booking",
            "rating",
            "comment",
        ]
