from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from app.models.user import User
from app.models.business import Business
from app.models.turf import Turf
from app.models.turf_image import TurfImage
from app.models.court import Court
from app.models.booking import Booking
from app.models.feedback import Feedback

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    ordering = ("-created_at",)
    list_display = (
        "phone_no",
        "name",
        "user_type",
        "is_active",
        "is_staff",
        "created_at",
    )
    list_filter = ("user_type", "is_active", "is_staff")
    search_fields = ("phone_no", "name", "email")

    fieldsets = (
        ("Basic Info", {"fields": ("phone_no", "name", "email", "password")}),
        (
            "Role & Permissions",
            {"fields": ("user_type", "is_active", "is_staff", "is_superuser")},
        ),
        ("Timestamps", {"fields": ("created_at", "updated_at")}),
    )

    readonly_fields = ("created_at", "updated_at")

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("phone_no", "name", "password1", "password2", "user_type"),
            },
        ),
    )

    username = None
    filter_horizontal = ()


@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    list_display = ("name", "user", "gstno")
    search_fields = ("name", "user__phone_no")


@admin.register(Turf)
class TurfAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "city",
        "state",
        "business",
        "is_open",
        "created_at",
    )
    list_filter = ("city", "state", "is_open")
    search_fields = ("name", "location", "city")

    readonly_fields = ("created_at", "updated_at")


@admin.register(TurfImage)
class TurfImageAdmin(admin.ModelAdmin):
    list_display = ("turf", "is_default")
    list_filter = ("is_default",)


@admin.register(Court)
class CourtAdmin(admin.ModelAdmin):
    list_display = (
        "turf",
        "sports_type",
        "price",
        "is_open",
        "created_at",
    )
    list_filter = ("sports_type", "is_open")
    search_fields = ("turf__name",)

    readonly_fields = ("created_at", "updated_at")


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "court",
        "booking_date",
        "start_time",
        "end_time",
        "amount",
        "status",
        "payment_status",
    )

    list_filter = (
        "status",
        "payment_status",
        "booking_date",
    )

    search_fields = (
        "id",
        "user__phone_no",
        "court__turf__name",
    )

    readonly_fields = (
        "id",
        "user",
        "court",
        "booking_date",
        "start_time",
        "end_time",
        "amount",
        "created_at",
        "updated_at",
    )

    actions = ["mark_confirmed", "mark_cancelled"]

    def mark_confirmed(self, request, queryset):
        queryset.update(status="CONFIRMED", payment_status="SUCCESS")

    mark_confirmed.short_description = "Mark selected bookings as CONFIRMED"

    def mark_cancelled(self, request, queryset):
        queryset.update(status="CANCELLED", payment_status="REFUNDED")

    mark_cancelled.short_description = "Cancel & Refund selected bookings"

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):

    def has_view_permission(self, request, obj=None):
        return request.user.is_staff

    def has_change_permission(self, request, obj=None):
        return False   # feedback should not be edited

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser

    list_display = (
        "id",
        "user",
        "turf",
        "rating",
        "comment",
        "created_at",
    )

    list_filter = (
        "rating",
        "created_at",
        "turf__city",
    )

    search_fields = (
        "user__phone_no",
        "turf__name",
        "comment",
    )

    readonly_fields = (
        "id",
        "user",
        "turf",
        "rating",
        "comment",
        "created_at",
    )
