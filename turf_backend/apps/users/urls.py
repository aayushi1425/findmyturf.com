from django.urls import path
from .views import UserLoginAPIView, UserRegisterAPIView , ListUserBusiness

urlpatterns = [
    path("login/", UserLoginAPIView.as_view(), name="user-login"),
    path("register/", UserRegisterAPIView.as_view(), name="user-register"),
    path("business/", ListUserBusiness.as_view(), name="user-business"),
]