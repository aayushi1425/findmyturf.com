from django.urls import path
from .views import BusinessLogin, BusinessRegister

urlpatterns = [
    path("login/", BusinessLogin.as_view(), name="business-login"),
    path("register/", BusinessRegister.as_view(), name="business-register"),
]