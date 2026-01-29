from django.urls import path
from .views import BookingAPIView, BookingDetailAPIView

urlpatterns = [
    path("", BookingAPIView.as_view(), name="booking-create-list"),
    path("<uuid:booking_id>/", BookingDetailAPIView.as_view(), name="booking-detail"),
]
