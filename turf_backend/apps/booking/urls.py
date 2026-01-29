from django.urls import path
from .views import BookingAPIView, BookingDetailAPIView , OwnerBookingsAPIView
 
urlpatterns = [
    path("", BookingAPIView.as_view()),
    path("list/", OwnerBookingsAPIView.as_view()),
    path("<uuid:booking_id>/", BookingDetailAPIView.as_view()),
]
