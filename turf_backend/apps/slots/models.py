import uuid
from django.db import models

class Slot(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    turf = models.ForeignKey("turfs.Turfs",
        on_delete = models.CASCADE,
        related_name = "slots"
    )

    slot_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_available = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "slots"
        unique_together = ("turf", "slot_date", "start_time", "end_time")
