from django.urls import path
from .views import  BusinessRegister , BusinessProfile

urlpatterns = [
    path("profile/", BusinessProfile.as_view(), name="business-profile"),
    path("profile/<uuid:pk>/", BusinessProfile.as_view(), name="business-profile"),
    path("register/", BusinessRegister.as_view(), name="business-register"),
]