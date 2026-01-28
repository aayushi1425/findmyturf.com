import uuid
from django.db import models

class BusinessUser(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey("users.User", on_delete=models.CASCADE)
    business_name = models.CharField(max_length=255)
    tenant_domain = models.TextField(unique=True)
    gst_number = models.CharField(max_length=15, unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "business"

    def __str__(self):
        return f"{self.business_name} ({self.tenant_domain})"