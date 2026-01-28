from rest_framework import serializers
from .models import Turfs

class TurfsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Turfs
        fields = "__all__"
        read_only_fields = ("id" , "owner" , "created_at" , "updated_at")
