import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email=None, phone_no=None, password=None, **extra_fields):
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

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if not email:
            raise ValueError("Superuser must have an email")

        return self.create_user(
            email=email,
            phone_no=None,   # ✅ explicitly pass phone_no
            password=password,
            **extra_fields
        )

class User(AbstractBaseUser, PermissionsMixin):
    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    name = models.CharField(max_length=255)

    email = models.EmailField(unique=True, null=True, blank=True)

    phone_no = models.CharField(
        max_length=15,
        unique=True,
        null=True,
        blank=True
    )

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    groups = models.ManyToManyField(
        "auth.Group",
        related_name="user_set",
        blank=True,
        help_text="The groups this user belongs to.",
        verbose_name="groups",
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="user_user_set",
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions",
    )

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    class Meta:
        db_table = "users"
        indexes = [
            models.Index(fields=["phone_no"]),
        ]

    def __str__(self):
        return f"{self.name} ({self.email or self.phone_no})"

    @property
    def id(self):
        return self.user_id