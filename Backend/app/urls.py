from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView

from app.views.auth import UserRegisterView, OwnerRegisterView
from app.views.turf import TurfCreateView, TurfUpdateView, TurfListView
from app.views.booking import BookingCreateView, MyBookingsView, CancelBookingView
from app.views.availability import TurfAvailableSlotsView
from app.views.payment import ConfirmPaymentView
from app.views.turf_image import TurfImageUploadView, SetDefaultTurfImageView, DeleteTurfImageView
from app.views.turf import TurfDetailView
from app.views.owner import OwnerTurfsView
from app.views.owner import OwnerTurfBookingsView

urlpatterns = [
    path('auth/login/', TokenObtainPairView.as_view()),
    # Register
    path('auth/register/user/', UserRegisterView.as_view()),
    path('auth/register/owner/', OwnerRegisterView.as_view()),

    # Turf
    path("turf/<uuid:turf_id>/", TurfDetailView.as_view()),
    path('turf/create/', TurfCreateView.as_view()),
    path('turf/<uuid:pk>/update/', TurfUpdateView.as_view()),
    path('turf/list/', TurfListView.as_view()),

    # Booking
    path('booking/create/', BookingCreateView.as_view()),
    path('booking/my/', MyBookingsView.as_view()),
    path('booking/<uuid:booking_id>/cancel/', CancelBookingView.as_view()),

    # slot avaible
    path('turf/<uuid:turf_id>/available-slots/', TurfAvailableSlotsView.as_view()),
    
    # Payment
    path('payment/confirm/<uuid:booking_id>/', ConfirmPaymentView.as_view()),

    path("turf/<uuid:turf_id>/image/upload/", TurfImageUploadView.as_view()),
    path("turf/image/<uuid:image_id>/set-default/", SetDefaultTurfImageView.as_view()),
    path("turf/image/<uuid:image_id>/delete/", DeleteTurfImageView.as_view()),

    path("owner/turfs/", OwnerTurfsView.as_view()),
    path("owner/turf/<uuid:turf_id>/bookings/" , OwnerTurfBookingsView.as_view()),

]
