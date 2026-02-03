import uuid
from django.db import models
from app.models.court import Court
from app.models.user import User

class BookingStatus(models.TextChoices):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    CANCELLED = "CANCELLED"

class PaymentStatus(models.TextChoices):
    INITIATED = "INITIATED"
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"
    REFUNDED = "REFUNDED"

class Booking(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    court = models.ForeignKey(Court, on_delete=models.CASCADE)
    
    booking_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()

    amount = models.IntegerField()
    status = models.CharField(max_length=20 , choices=BookingStatus.choices , default=BookingStatus.PENDING)

    payment_status = models.CharField(max_length=20 , choices=PaymentStatus.choices , default=PaymentStatus.INITIATED)
    provider_payment_id = models.CharField(max_length=100 , null=True , blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'booking'
        indexes = [
            models.Index(fields=['id'], name='booking_id_idx'),
            models.Index(fields=['court'], name='booking_court_idx'),
            models.Index(fields=['user'], name='booking_user_idx'),
            models.Index(fields=['booking_date'], name='booking_date_idx'),
        ]