from django.contrib.auth.models import BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self , phone_no , password=None, **extra_fields):
        if not phone_no:
            raise ValueError("Phone number is required")

        user = self.model(
            phone_no=phone_no,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user