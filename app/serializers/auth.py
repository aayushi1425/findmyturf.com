from rest_framework import serializers
from app.models.user import User, UserType
from app.models.business import Business

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['name', 'phone_no', 'password']

    def create(self, data):
        return User.objects.create_user(
            phone_no=data['phone_no'],
            password=data['password'],
            name=data['name'],
            user_type=UserType.USER.value
        )


class OwnerRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    business_name = serializers.CharField()
    tenant = serializers.CharField()

    class Meta:
        model = User
        fields = ['name', 'phone_no', 'password', 'business_name', 'tenant']

    def create(self, data):
        business_name = data.pop('business_name')
        tenant = data.pop('tenant')

        user = User.objects.create_user(
            phone_no=data['phone_no'],
            password=data['password'],
            name=data['name'],
            user_type=UserType.OWNER.value
        )

        Business.objects.create(
            user=user,
            name=business_name,
            tenant=tenant
        )

        return user
