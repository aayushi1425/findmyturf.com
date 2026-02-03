from django.urls import path

from app.views.auth import (
    UserRegisterView,
    OwnerRegisterView,
    LoginView,
)

from app.views.turf import (
    TurfCreateView,
    TurfUpdateView,
    TurfListView,
    TurfDetailView,
)

from app.views.booking import (
    BookingCreateView,
    MyBookingsView,
    BookingDetailView,
    CancelBookingView,
)
from app.views.court import CourtCreateView, TurfCourtsView


from app.views.availability import CourtAvailableSlotsView
from app.views.payment import ConfirmPaymentView

from app.views.turf_image import (
    TurfImageUploadView,
    SetDefaultTurfImageView,
    DeleteTurfImageView,
)

from app.views.owner import (
    OwnerTurfsView,
    OwnerTurfBookingsView,
)

urlpatterns = [
    path("auth/login/", LoginView.as_view()),
    path("auth/register/user/", UserRegisterView.as_view()),
    path("auth/register/owner/", OwnerRegisterView.as_view()),
    
    # Public
    path("turf/list/", TurfListView.as_view()),
    path("turf/<uuid:turf_id>/", TurfDetailView.as_view()),

    # Owner
    path("turf/create/", TurfCreateView.as_view()),
    path("turf/<uuid:turf_id>/update/", TurfUpdateView.as_view()),
    path("turf/<uuid:turf_id>/image/upload/", TurfImageUploadView.as_view()),
    path("turf/image/<uuid:image_id>/set-default/", SetDefaultTurfImageView.as_view(),),
    path("turf/image/<uuid:image_id>/delete/",DeleteTurfImageView.as_view()),

    # Courts
    path("court/create/", CourtCreateView.as_view()),
    path("turf/<uuid:turf_id>/courts/", TurfCourtsView.as_view()),
    path("court/<uuid:court_id>/available-slots/",CourtAvailableSlotsView.as_view(),),

    path("booking/create/", BookingCreateView.as_view()),
    path("booking/my/", MyBookingsView.as_view()),
    
    path("booking/<uuid:booking_id>/", BookingDetailView.as_view()),
    path(
        "booking/<uuid:booking_id>/cancel/",
        CancelBookingView.as_view(),
    ),
    path(
        "payment/confirm/<uuid:booking_id>/",
        ConfirmPaymentView.as_view(),
    ),
    path("owner/turfs/", OwnerTurfsView.as_view()),
    path(
        "owner/turf/<uuid:turf_id>/bookings/",
        OwnerTurfBookingsView.as_view(),
    ),
]
