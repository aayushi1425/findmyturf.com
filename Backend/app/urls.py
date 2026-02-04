from django.urls import path
from app.views.payment import ConfirmPaymentView
from app.views.availability import CourtAvailableSlotsView
from app.views.court import CourtCreateView, TurfCourtsView , GetCourtView , CourtUpdateView
from app.views.owner import OwnerTurfsView , OwnerTurfBookingsView
from app.views.auth import UserRegisterView, OwnerRegisterView, LoginView
from app.views.turf import TurfCreateView, TurfUpdateView, TurfListView, TurfDetailView
from app.views.turf_image import TurfImageUploadView , SetDefaultTurfImageView , DeleteTurfImageView
from app.views.booking import BookingCreateView , MyBookingsView , BookingDetailView , CancelBookingView
from rest_framework_simplejwt.views import TokenObtainPairView

from app.views.auth import UserRegisterView, OwnerRegisterView
from app.views.turf import TurfCreateView, TurfUpdateView, TurfListView
from app.views.booking import BookingCreateView, MyBookingsView, CancelBookingView
from app.views.payment import ConfirmPaymentView, CreateRazorpayOrderView, RazorpayWebhookView, RazorpayVerifyView
from app.views.turf_image import TurfImageUploadView, SetDefaultTurfImageView, DeleteTurfImageView
from app.views.turf import TurfDetailView
from app.views.owner import OwnerTurfsView
from app.views.owner import OwnerTurfBookingsView

urlpatterns = [
    path("auth/login/", LoginView.as_view()),
    path("auth/register/user/", UserRegisterView.as_view()),
    path("auth/register/owner/", OwnerRegisterView.as_view()),

    # Public
    path("turf/list/", TurfListView.as_view()),
    path("turf/<uuid:turf_id>/", TurfDetailView.as_view()),
    path('turf/create/', TurfCreateView.as_view()),
    path('turf/<uuid:pk>/update/', TurfUpdateView.as_view()),
    path('turf/list/', TurfListView.as_view()),

    # Booking
    # path('booking/<uuid:turf_id>/', BookingByTurf.as_view()),
    path('booking/create/', BookingCreateView.as_view()),
    path('booking/my/', MyBookingsView.as_view()),
    path('booking/<uuid:booking_id>/cancel/', CancelBookingView.as_view()),

    # slot avaible
    
    # Payment
    path('payment/confirm/<uuid:booking_id>/', ConfirmPaymentView.as_view()),
    # Razorpay: create order + webhook
    path('payment/razorpay/create/<uuid:booking_id>/', CreateRazorpayOrderView.as_view()),
    path('payment/razorpay/webhook/', RazorpayWebhookView.as_view()),
    path('payment/razorpay/verify/', RazorpayVerifyView.as_view()),

    # turfs
    path("turf/create/", TurfCreateView.as_view()),
    path("turf/<uuid:turf_id>/update/", TurfUpdateView.as_view()),
    path("turf/<uuid:turf_id>/image/upload/", TurfImageUploadView.as_view()),
    path("turf/image/<uuid:image_id>/delete/", DeleteTurfImageView.as_view()),
    path("turf/image/<uuid:image_id>/set-default/" , SetDefaultTurfImageView.as_view()),

    # Courts
    path("court/create/", CourtCreateView.as_view()),
    path("court/<uuid:court_id>/update/", CourtUpdateView.as_view()),
    path("turf/<uuid:turf_id>/courts/", TurfCourtsView.as_view()),

    path("court/<uuid:court_id>/", GetCourtView.as_view()),
    path("court/<uuid:court_id>/available-slots/", CourtAvailableSlotsView.as_view()),

    # Booking Apis
    path("booking/create/", BookingCreateView.as_view()),
    path("booking/my/", MyBookingsView.as_view()),
    path("booking/<uuid:booking_id>/", BookingDetailView.as_view()),
    path("booking/<uuid:booking_id>/cancel/", CancelBookingView.as_view()),

    # Demo Payment Confirm Api
    path("payment/confirm/<uuid:booking_id>/", ConfirmPaymentView.as_view()),

    # Owner Apis
    path("owner/turfs/", OwnerTurfsView.as_view()),
    path("owner/turf/<uuid:turf_id>/bookings/", OwnerTurfBookingsView.as_view()),
]