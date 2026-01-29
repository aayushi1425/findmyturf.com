import uuid
from django.db import models

class Turf(models.Model):

    class SportsType(models.TextChoices):
        CRICKET = "CRICKET"
        FOOTBALL = "FOOTBALL"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    owner = models.ForeignKey(
        "business.BusinessUser",
        on_delete=models.CASCADE,
        related_name="turfs"
    )

    name = models.CharField(max_length=255)
    description = models.TextField()

    sports_type = models.CharField(
        max_length=20,
        choices=SportsType.choices
    )

    location = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.IntegerField()

    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)

    dimension = models.CharField(max_length=50)  # L x B x H

    is_open = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "turfs"
        ordering = ["-created_at"]

    def __str__(self):
        return self.name
