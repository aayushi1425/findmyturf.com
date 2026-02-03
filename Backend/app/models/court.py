import uuid
from enum import Enum
from django.db import models
from app.models.turf import Turf

class SportsType(Enum):
    GOLF = "GOLF"
    TENNIS = "TENNIS"
    CRICKET = "CRICKET"
    FOOTBALL = "FOOTBALL"
    BADMINTON = "BADMINTON"
    VOLLEYBALL = "VOLLEYBALL"
    PICKLEBALL = "PICKLEBALL"
    

class Court(models.Model):
    id = models.UUIDField(primary_key = True, default = uuid.uuid4)
    turf = models.ForeignKey(Turf , on_delete = models.CASCADE)
    sports_type = models.CharField(max_length = 20 , choices = [(tag.name, tag.value) for tag in SportsType] , default = SportsType.CRICKET.value)
    price = models.IntegerField()
    is_open = models.BooleanField(default = True)

    length = models.IntegerField()
    width = models.IntegerField()
    height = models.IntegerField()

    created_at = models.DateTimeField(auto_now_add = True)
    updated_at = models.DateTimeField(auto_now = True)

    class Meta:
        db_table = 'court'
        indexes = [
            models.Index(fields=['id'], name='court_id_idx'),
            models.Index(fields=['turf'], name='turf_idx'),
        ]