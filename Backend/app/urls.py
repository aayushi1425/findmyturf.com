from django.urls import path
from app.views.payment import ConfirmPaymentView
from app.views.availability import CourtAvailableSlotsView
from app.views.court import CourtCreateView, TurfCourtsView , GetCourtView , CourtUpdateView, CourtDeleteView
from app.views.owner import OwnerTurfsView , OwnerTurfBookingsView
from app.views.auth import UserRegisterView, OwnerRegisterView, LoginView
from app.views.turf import TurfCreateView, TurfUpdateView, TurfListView, TurfDetailView
from app.views.turf_image import TurfImageUploadView , SetDefaultTurfImageView , DeleteTurfImageView
from app.views.booking import BookingCreateView , MyBookingsView , BookingDetailView , CancelBookingView
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework.permissions import AllowAny

schema_view = get_schema_view(
    openapi.Info(
        title="FindMyTurf API",
        default_version="v1",
    ),
    public=True,
    permission_classes=[AllowAny],
)


urlpatterns = [
    
    # Documentation
    path("swagger/", schema_view.with_ui("swagger", cache_timeout=0)),
    path("redoc/", schema_view.with_ui("redoc", cache_timeout=0)),

    # Auth
    path("auth/login/", LoginView.as_view()),
    path("auth/register/user/", UserRegisterView.as_view()),
    path("auth/register/owner/", OwnerRegisterView.as_view()),

    # Public
    path("turf/list/", TurfListView.as_view()),
    path("turf/<uuid:turf_id>/", TurfDetailView.as_view()),

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
    path("court/<uuid:court_id>/delete/", CourtDeleteView.as_view()),

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