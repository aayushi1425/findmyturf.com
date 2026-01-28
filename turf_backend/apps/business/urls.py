from django.urls import path
from .views import  BusinessRegister , GetBusinessProfile

urlpatterns = [
    path("profile/", GetBusinessProfile.as_view(), name="business-profile"),
    path("register/", BusinessRegister.as_view(), name="business-register"),
]