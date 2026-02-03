import uuid
from cloudinary.models import CloudinaryField
from django.db import models
from app.models.turf import Turf


class TurfImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    turf = models.ForeignKey(Turf, on_delete=models.CASCADE, related_name="images")
    image = CloudinaryField("image", folder="turf_images")
    is_default = models.BooleanField(default=False)

    class Meta:
        db_table = "turf_image"
        indexes = [
            models.Index(fields=["id"], name="turf_image_id_idx"),
            models.Index(fields=["turf"], name="turf_idx"),
        ]