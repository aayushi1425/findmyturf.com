from django.urls import path
from .views import (
    TurfListCreateView,
    TurfDetailView,
    TurfStatusUpdateView,
)

urlpatterns = [
    path("turfs/", TurfListCreateView.as_view()),
    path("turfs/<uuid:turf_id>/", TurfDetailView.as_view()),
    path("turfs/<uuid:turf_id>/status/", TurfStatusUpdateView.as_view()),
]
