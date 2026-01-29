from django.urls import path
from .views import (
    TurfListCreateAPIView,
    TurfDetailAPIView,
    TurfStatusAPIView
)

urlpatterns = [
    path("turfs/", TurfListCreateAPIView.as_view()),
    path("turfs/<uuid:turf_id>/", TurfDetailAPIView.as_view()),
    path("turfs/<uuid:turf_id>/status/", TurfStatusAPIView.as_view()),
]
