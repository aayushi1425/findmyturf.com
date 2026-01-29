import uuid
from django.db import models
from app.models.turf import Turf
from app.models.user import User

class Booking(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    status = models.CharField(max_length = 20 ,
        choices=[('CONFIRMED', 'CONFIRMED'), ('CANCELLED', 'CANCELLED')],
        default='CONFIRMED'
    )
    
    turf = models.ForeignKey(Turf, on_delete=models.CASCADE)
    custumer = models.ForeignKey(User , on_delete=models.CASCADE)
    amount = models.IntegerField(editable=False)
    booking_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'booking'
        indexes = [
            models.Index(fields=['id'], name='booking_id_idx'),
            models.Index(fields=['turf'], name='turf_idx'),
        ]

    def __str__(self):
        return f"Booking {self.id} for {self.customer_name}"