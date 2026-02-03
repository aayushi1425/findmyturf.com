import uuid
from django.db import models
from app.models.business import Business

class Turf(models.Model):
    id = models.UUIDField(primary_key = True, default = uuid.uuid4)
    business = models.ForeignKey(Business , on_delete = models.CASCADE)

    name = models.CharField(max_length = 100, null = True)
    description = models.TextField(null = True)
    location = models.CharField(max_length = 255, null = True)
    city = models.CharField(max_length = 100)
    state = models.CharField(max_length = 100)

    latitude = models.FloatField()
    longitude = models.FloatField()

    is_open = models.BooleanField(default=True)

    opening_time = models.TimeField(default="06:00")
    closing_time = models.TimeField(default="23:00")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'turf'
        indexes = [
            models.Index(fields=['id'], name='turf_id_idx'),
            models.Index(fields=['business'], name='business_idx'),
        ]

    def __str__(self):
        return self.name
    
    @property
    def dimensions_display(self):
        return f"{self.length}m x {self.breadth}m x {self.height}m"
