import uuid
from django.db import models

class BookingStatus(models.TextChoices):
    CONFIRMED = "CONFIRMED", "Confirmed"
    CANCELLED = "CANCELLED", "Cancelled"

class Booking(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey("users.User" , on_delete=models.CASCADE)
    slot = models.OneToOneField("slots.Slot" , on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20 , choices=BookingStatus.choices , default=BookingStatus.CONFIRMED)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking #{self.id}"