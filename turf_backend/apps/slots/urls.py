from django.urls import path
from .views import TurfSlotsAPIView, SlotAvailabilityAPIView

urlpatterns = [
    path(
        "turfs/<uuid:turf_id>/slots/",
        TurfSlotsAPIView.as_view(),
        name="turf-slots"
    ),
    path(
        "slots/<uuid:slot_id>/",
        SlotAvailabilityAPIView.as_view(),
        name="slot-availability"
    ),
]
