import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser , BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self , email , phone_no , password = None, **extra_fields):
        if not email and not phone_no:
            raise ValueError("Email or phone number is required")

        if email:
            email = self.normalize_email(email)

        user = self.model(
            email=email,
            phone_no=phone_no,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    id = models.UUIDField(primary_key = True, default = uuid.uuid4)
    name = models.CharField(max_length = 255)
    email = models.EmailField(unique = True , null = True, blank = True)
    phone_no = models.CharField(max_length = 10 , unique=True )
    created_at = models.DateTimeField(auto_now_add = True)
    updated_at = models.DateTimeField(auto_now = True)

    objects = UserManager()

    USERNAME_FIELD = "phone_no"
    REQUIRED_FIELDS = ["name"]

    class Meta:
        db_table = "users"
        indexes = [
            models.Index(fields=["phone_no"]),
            models.Index(fields=["email"]),
        ]

    def __str__(self):
        return f"{self.name} ({self.email or self.phone_no})"