from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("api/user/", include("apps.users.urls")),
    path("api/business/", include("apps.business.urls")),
]