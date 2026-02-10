from django.urls import path
from app.views.payment import ConfirmPaymentView, CreateRazorpayOrderView, RazorpayWebhookView, RazorpayVerifyView
from app.views.availability import CourtAvailableSlotsView
from app.views.court import CourtCreateView, TurfCourtsView , GetCourtView , CourtUpdateView , CourtDeleteView
from app.views.owner import OwnerTurfsView , OwnerTurfBookingsView , OwnerAnalyticsSummaryView , OwnerTurfAnalyticsView
from app.views.auth import UserRegisterView, OwnerRegisterView, LoginView
from app.views.turf import TurfCreateView , TurfUpdateView , TurfListView , TurfDetailView , MostBookedTurfView
from app.views.turf_image import TurfImageUploadView , SetDefaultTurfImageView , DeleteTurfImageView
from app.views.booking import BookingCreateView , MyBookingsView , BookingDetailView , CancelBookingView
from app.views.feedback import FeedbackCreateView, TurfFeedbacksView, BookingFeedbackView

urlpatterns = [
    path("auth/login/", LoginView.as_view()),
    path("auth/register/user/", UserRegisterView.as_view()),
    path("auth/register/owner/", OwnerRegisterView.as_view()),
    # Public
    path("turf/list/", TurfListView.as_view(), name="turf-list"),
    path("turf/<slug:slug>/", TurfDetailView.as_view(), name="turf-detail"),
    path("turf/most-booked/", MostBookedTurfView.as_view(), name="most-booked-turf"),
    # turfs
    path("turf/create/", TurfCreateView.as_view()),
    path("turf/<slug:slug>/update/", TurfUpdateView.as_view()),
    path("turf/<slug:slug>/image/upload/", TurfImageUploadView.as_view()),
    path("turf/image/<uuid:image_id>/delete/", DeleteTurfImageView.as_view()),
    path("turf/image/<uuid:image_id>/set-default/", SetDefaultTurfImageView.as_view()),
    # Courts
    path("court/create/", CourtCreateView.as_view()),
    path("court/<uuid:court_id>/update/", CourtUpdateView.as_view()),
    path("turf/<slug:slug>/courts/", TurfCourtsView.as_view()),
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
    # Razorpay
    path('payment/razorpay/create/<uuid:booking_id>/', CreateRazorpayOrderView.as_view()),
    path('payment/razorpay/webhook/', RazorpayWebhookView.as_view()),
    path('payment/razorpay/verify/', RazorpayVerifyView.as_view()),
    # Owner Apis
    path("owner/turfs/", OwnerTurfsView.as_view()),
    path("owner/turf/<slug:slug>/bookings/", OwnerTurfBookingsView.as_view()),
    path("owner/analytics/summary/", OwnerAnalyticsSummaryView.as_view()),
    path("owner/turf/<slug:slug>/analytics/", OwnerTurfAnalyticsView.as_view()),
    
    # Feedback Apis
    path("feedback/create/", FeedbackCreateView.as_view()),
    path("feedback/turf/", TurfFeedbacksView.as_view()),
    path("feedback/booking/<uuid:booking_id>/", BookingFeedbackView.as_view()),
]