import uuid
from django.db import models
from app.models.user import User

class Business(models.Model):
    id = models.UUIDField(primary_key = True, default = uuid.uuid4 )
    user = models.OneToOneField(User , on_delete = models.CASCADE )
    name = models.CharField(max_length = 100 , null = True)
    gstno = models.CharField(max_length = 15 , null = True)

    class Meta:
        db_table = 'business'
        indexes = [
            models.Index(fields=['id'], name='business_id_idx'),
            models.Index(fields=['user'], name='user_idx'),
        ]

    def __str__(self):
        return self.name