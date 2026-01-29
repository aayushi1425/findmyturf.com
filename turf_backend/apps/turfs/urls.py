from django.urls import path
from .views import BusinessTurfs, TurfImageDetailAPIView, TurfImageListCreateAPIView , TurfList

urlpatterns = [
    path("list/" , TurfList.as_view()),  
    path("master/" , BusinessTurfs.as_view()),
    path("<uuid:pk>/" , BusinessTurfs.as_view()), 
    path("turfs/<uuid:turf_id>/images/", TurfImageListCreateAPIView.as_view()),
    path("images/<uuid:image_id>/", TurfImageDetailAPIView.as_view()),
]