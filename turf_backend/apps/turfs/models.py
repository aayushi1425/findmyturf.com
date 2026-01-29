from django.db import models
from uuid import uuid4
from enum import Enum

class SportType(Enum):
    FOOTBALL = "FOOTBALL"
    CRICKET = "CRICKET"

class Turfs(models.Model):
    id = models.UUIDField(primary_key = True, default = uuid4 )
    owner = models.ForeignKey("users.User", on_delete=models.CASCADE)
    name = models.CharField(max_length = 255)
    description = models.TextField()
    sport_type = models.CharField(max_length = 20, choices = [(sport.value, sport.value) for sport in SportType])
    location = models.CharField(max_length = 255)
    city = models.CharField(max_length = 255)
    price = models.DecimalField(max_digits = 10, decimal_places = 2)
    state = models.CharField(max_length = 255)
    pincode = models.CharField(max_length = 6)
    latitude = models.DecimalField(max_digits = 9, decimal_places = 6)
    longitude = models.DecimalField(max_digits = 9, decimal_places = 6)
    dimensions = models.CharField(max_length = 255) # L X B X H
    is_open = models.BooleanField(default = True)
    created_at = models.DateTimeField(auto_now_add = True)
    updated_at = models.DateTimeField(auto_now = True)
    
    class Meta:
        db_table = "turfs"

    def __str__(self):
        return self.name