import uuid
from enum import Enum
from django.db import models
from django.contrib.auth.models import AbstractUser
from app.manager import UserManager

class UserType(Enum):
    USER = 'USER'
    OWNER = 'OWNER'
    ADMIN = 'ADMIN'

class User(AbstractUser):
    username = None
    first_name = None
    last_name = None
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, null=True)
    phone_no = models.CharField(max_length=15, unique=True, null=True)
    email = models.EmailField(unique=True, null=True , blank=True)
    user_type = models.CharField(max_length=10, choices=[(tag.name, tag.value) for tag in UserType], default = UserType.USER.value)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'phone_no'
    REQUIRED_FIELDS = ['name']

    class Meta:
        db_table = 'user'
        indexes = [
            models.Index(fields=['id'], name='user_id_idx'),
            models.Index(fields=['phone_no'], name='phone_no_idx'),
            models.Index(fields=['email'], name='email_idx'),
        ]
    
    def __str__(self):
        return self.name