import uuid
from django.db import models
from app.models.booking import Booking
from app.models.turf import Turf
from app.models.user import User

class Feedback(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='feedbacks')
    turf = models.ForeignKey(Turf, on_delete=models.CASCADE, related_name='feedbacks')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feedbacks')
    
    rating = models.IntegerField(help_text="Rating from 1 to 5")
    comment = models.TextField(blank=True, null=True, help_text="Optional feedback comment")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'feedback'
        indexes = [
            models.Index(fields=['id'], name='feedback_id_idx'),
            models.Index(fields=['turf'], name='feedback_turf_idx'),
            models.Index(fields=['user'], name='feedback_user_idx'),
            models.Index(fields=['booking'], name='feedback_booking_idx'),
        ]
        constraints = [
            models.UniqueConstraint(fields=['booking'], name='unique_booking_feedback'),
        ]

    def __str__(self):
        return f"Feedback for {self.turf.name} by {self.user.name} - {self.rating} stars"
