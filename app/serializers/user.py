from rest_framework import serializers
from models.user import User, UserType

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'name', 'phone_no', 'password', 'user_type']

    def create(self, validated_data):
        user = User.objects.create_user(
            phone_no=validated_data['phone_no'],
            password=validated_data['password'],
            name=validated_data.get('name'),
            user_type=validated_data.get('user_type', UserType.USER.value)
        )
        return user
