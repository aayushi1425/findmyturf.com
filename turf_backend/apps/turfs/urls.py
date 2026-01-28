from django.urls import path
from .views import BusinessTurfs , TurfList

urlpatterns = [
    path("list/" , TurfList.as_view()),  # for normal users to search a turf in area
    path("master/" , BusinessTurfs.as_view()), # to create new turf , get , update , delete
    path("<uuid:pk>/" , BusinessTurfs.as_view()), 
]