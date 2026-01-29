from django.urls import path
from .views import  BusinessRegister , BusinessProfile

urlpatterns = [
    path("register/", BusinessRegister.as_view()),
    path("profile/", BusinessProfile.as_view()),
    path("profile/<uuid:pk>/", BusinessProfile.as_view())
]