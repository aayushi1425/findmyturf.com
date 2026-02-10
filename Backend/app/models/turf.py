import uuid
from django.db import models
from django.utils.text import slugify
from app.models.business import Business
from django.contrib.postgres.fields import ArrayField

class Turf(models.Model):
    id = models.UUIDField(primary_key = True, default = uuid.uuid4)
    business = models.ForeignKey(Business , on_delete = models.CASCADE)
    slug = models.SlugField(max_length=255, blank=True, null=True)
    amenities = ArrayField(models.CharField(max_length=100), blank=True, default=list)
    name = models.CharField(max_length = 100, null = True)
    description = models.TextField(null = True)
    location = models.CharField(max_length = 255, null = True)
    city = models.CharField(max_length = 100)
    state = models.CharField(max_length = 100)

    latitude = models.FloatField()
    longitude = models.FloatField()

    is_open = models.BooleanField(default=True)

    opening_time = models.TimeField(default="06:00")
    closing_time = models.TimeField(default="23:00")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'turf'
        indexes = [
            models.Index(fields=['id'], name='turf_id_idx'),
            models.Index(fields=['business'], name='business_idx'),
        ]

    def __str__(self):
        return self.name
    
    @property
    def dimensions_display(self):
        return f"{self.length}m x {self.breadth}m x {self.height}m"

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            count = 1
            while Turf.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{count}"
                count += 1
            self.slug = slug
        super().save(*args, **kwargs)
