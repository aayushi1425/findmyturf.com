from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from app.models.feedback import Feedback
from app.models.booking import Booking, BookingStatus
from app.models.turf import Turf
from app.serializers.feedback import FeedbackSerializer, FeedbackCreateSerializer


class FeedbackCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = FeedbackCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        booking = data.get("booking")
        rating = data.get("rating")
        comment = data.get("comment", "")

        if rating < 1 or rating > 5:
            return Response(
                {"error": "Rating must be between 1 and 5"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        booking = Booking.objects.select_related("court__turf", "user").get(
            id=booking.id
        )
        if booking.status != BookingStatus.CONFIRMED:
            return Response(
                {"error": "Feedback can only be submitted for confirmed bookings"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if booking.user != request.user:
            return Response(
                {"error": "You can only submit feedback for your own bookings"},
                status=status.HTTP_403_FORBIDDEN,
            )

        if Feedback.objects.filter(booking_id=booking.id).exists():
            return Response(
                {"error": "Feedback already exists for this booking"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        feedback = Feedback.objects.create(
            booking=booking,
            turf=booking.court.turf,
            user=request.user,
            rating=rating,
            comment=comment,
        )

        return Response(
            FeedbackSerializer(feedback).data,
            status=status.HTTP_201_CREATED,
        )


class TurfFeedbacksView(APIView):
    def get(self, request):
        turf_id = request.query_params.get("tid")

        if not turf_id:
            return Response(
                {"error": "turf_id query parameter is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            turf = Turf.objects.get(id=turf_id, is_open=True)
        except Turf.DoesNotExist:
            return Response(
                {"error": "Turf not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        feedbacks = Feedback.objects.filter(turf=turf).order_by("-created_at")
        serializer = FeedbackSerializer(feedbacks, many=True)

        return Response(serializer.data)


class BookingFeedbackView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, booking_id):
        try:
            booking = Booking.objects.get(id=booking_id, user=request.user)
        except Booking.DoesNotExist:
            return Response(
                {"error": "Booking not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            feedback = Feedback.objects.get(booking=booking)
            serializer = FeedbackSerializer(feedback)
            return Response(serializer.data)
        except Feedback.DoesNotExist:
            return Response(
                {"detail": "No feedback found for this booking"},
                status=status.HTTP_404_NOT_FOUND,
            )
