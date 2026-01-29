from rest_framework.permissions import BasePermission
from app.models.user import UserType

class IsOwner(BasePermission):
    def has_permission(self, request, view):
        return request.user.user_type == UserType.OWNER.value

class IsUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.user_type == UserType.USER.value
