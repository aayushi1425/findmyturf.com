from django.urls import path
from .views import BusinessTurfs , TurfList

urlpatterns = [
    path("list/" , TurfList.as_view()),  
    path("master/" , BusinessTurfs.as_view()),
    path("<uuid:pk>/" , BusinessTurfs.as_view()), 
]