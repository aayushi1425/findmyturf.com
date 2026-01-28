import uuid
from django.db import models
from apps.business.models import BusinessUser


class Turf(models.Model):

    class SportsType(models.TextChoices):
        CRICKET = "CRICKET", "Cricket"
        FOOTBALL = "FOOTBALL", "Football"

    turf_id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        unique=True
    )

    owner = models.ForeignKey(
        BusinessUser,
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

    dimension = models.CharField(max_length=100)  # L x B x H

    is_open = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "turfs"

    def __str__(self):
        return self.name


class TurfImage(models.Model):
    image_id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    turf = models.ForeignKey(
        Turf,
        on_delete=models.CASCADE,
        related_name="images"
    )

    image = models.ImageField(upload_to="turf_images/")
    is_primary = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "turf_images"

    def __str__(self):
        return f"Image for {self.turf.name}"
