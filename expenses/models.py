from django.db import models
from django.contrib.auth.models import User


class Expense(models.Model):
    CATEGORY_CHOICES = [
        ('Food', 'Food'),
        ('Rent', 'Rent'),
        ('Utilities', 'Utilities'),
        ('Entertainment', 'Entertainment'),
        ('Travel', 'Travel'),
        ('Shopping', 'Shopping'),
        ('Others', 'Others'),
    ]

    title = models.CharField(max_length=100)
    amount = models.FloatField()
    date = models.DateField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    group_name = models.CharField(max_length=100)  # Store group name here