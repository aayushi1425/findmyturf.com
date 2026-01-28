import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser , PermissionsMixin , BaseUserManager

class BusinessClientManager(BaseUserManager):
    def create_user(
        self, business_email, business_phone, password=None, **extra_fields
    ):
        if not business_email:
            raise ValueError("Business email is required")

        if not business_phone:
            raise ValueError("Business phone is required")

        business_email = self.normalize_email(business_email)
        user = self.model(
            business_email=business_email, business_phone=business_phone, **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

class BusinessClient(AbstractBaseUser, PermissionsMixin):
    business_id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, unique=True
    )
    business_name = models.CharField(max_length=255, null=False, blank=False)
    business_email = models.EmailField(unique=True, null=False, blank=False)
    business_phone = models.CharField(
        max_length=20, unique=True, null=False, blank=False
    )
    gst_number = models.CharField(max_length=15, unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    groups = models.ManyToManyField(
        "auth.Group",
        related_name="businessclient_set",
        blank=True,
        help_text="The groups this user belongs to.",
        verbose_name="groups",
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="businessclient_user_set",
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions",
    )

    objects = BusinessClientManager()
    USERNAME_FIELD = "business_email"
    REQUIRED_FIELDS = ["business_phone", "business_name"]

    class Meta:
        db_table = "business"

    def __str__(self):
        return f"{self.business_name} ({self.business_email})"
