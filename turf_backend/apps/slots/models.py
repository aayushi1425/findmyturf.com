import uuid
from django.db import models
from django.core.exceptions import ValidationError


class Slot(models.Model):
    slot_id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    turf = models.ForeignKey(
        "turfs.Turfs",
        on_delete=models.CASCADE,
        related_name="slots"
    )

    slot_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()

    is_available = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "slots"
        unique_together = ("turf", "slot_date", "start_time", "end_time")
        indexes = [
            models.Index(fields=["turf", "slot_date"]),
            models.Index(fields=["turf", "slot_date", "is_available"]),
        ]

    def clean(self):
        if self.start_time >= self.end_time:
            raise ValidationError("start_time must be before end_time")

    def __str__(self):
        return (
            f"{self.turf} | "
            f"{self.slot_date} | "
            f"{self.start_time}-{self.end_time} | "
            f"{'Available' if self.is_available else 'Blocked'}"
        )
