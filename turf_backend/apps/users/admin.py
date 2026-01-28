from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    ordering = ("created_at",)

    list_display = (
        "email",
        "phone_no",
        "name",
        "is_staff",
        "is_active",
    )

    list_filter = ("is_staff", "is_active")
    search_fields = ("email", "phone_no", "name")

    fieldsets = (
        (None, {"fields": ("email", "phone_no", "password")}),
        ("Personal Info", {"fields": ("name",)}),
        ("Permissions", {
            "fields": (
                "is_active",
                "is_staff",
                "is_superuser",
                "groups",
                "user_permissions",
            )
        }),
        ("Important Dates", {"fields": ("last_login", "created_at", "updated_at")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "email",
                "phone_no",
                "name",
                "password1",
                "password2",
                "is_staff",
                "is_active",
            ),
        }),
    )

    readonly_fields = ("created_at", "updated_at", "last_login")
