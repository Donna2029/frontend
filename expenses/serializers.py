from rest_framework import serializers
from .models import Expense
from django.contrib.auth.models import User
class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'
from .models import Profile  # Ensure you import the Profile model

class UserSignupSerializer(serializers.ModelSerializer):
    group_name = serializers.CharField()

    class Meta:
        model = User
        fields = ['username', 'password', 'group_name']

    def create(self, validated_data):
        group_name = validated_data.pop('group_name')
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        profile = Profile.objects.create(user=user, group_name=group_name)
        return user

