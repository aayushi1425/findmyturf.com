from django.contrib import admin
from django.http import JsonResponse
from django.urls import path , include

urlpatterns = [
    path("", lambda request: JsonResponse({"status": "FindMyTurf API running"})),
    path("admin/", admin.site.urls),
    path('api/', include("app.urls")),
]
