from django.urls import path
from .views import SlotListAPIView

urlpatterns = [
    path("list/", SlotListAPIView.as_view()),
]