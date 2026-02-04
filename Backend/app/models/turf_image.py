import uuid
from django.db import models
from django.db.models import Q
from app.models.turf import Turf
from cloudinary.models import CloudinaryField

class TurfImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    turf = models.ForeignKey(Turf, on_delete=models.CASCADE, related_name="images")
    image = CloudinaryField("image", folder="turf_images")
    is_default = models.BooleanField(default=False)

    class Meta:
        db_table = "turf_image"
        indexes = [
            models.Index(fields=["id"], name="turf_image_id_idx"),
            models.Index(fields=["turf"], name="turf_image_turf_idx"),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=["turf"],
                condition=Q(is_default=True),
                name="unique_default_image_per_turf",
            )
        ]