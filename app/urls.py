from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView

from app.views.auth import UserRegisterView, OwnerRegisterView
from app.views.turf import TurfCreateView, TurfUpdateView, TurfListView
from app.views.booking import BookingCreateView, MyBookingsView, BookingCancelView
from app.views.availability import TurfAvailableSlotsView

urlpatterns = [
    path('auth/login/', TokenObtainPairView.as_view()),
    # Register
    path('auth/register/user/', UserRegisterView.as_view()),
    path('auth/register/owner/', OwnerRegisterView.as_view()),

    # Turf
    path('turf/create/', TurfCreateView.as_view()),
    path('turf/<uuid:pk>/update/', TurfUpdateView.as_view()),
    path('turf/list/', TurfListView.as_view()),

    # Booking
    path('booking/create/', BookingCreateView.as_view()),
    path('booking/my/', MyBookingsView.as_view()),
    path('booking/<uuid:pk>/cancel/', BookingCancelView.as_view()),

    # slot avaible
    path('turf/<uuid:turf_id>/available-slots/', TurfAvailableSlotsView.as_view()),
]
