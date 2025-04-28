# expenses/urls.py
from django.urls import path
from . import views  # Ensure that views are imported correctly

urlpatterns = [
    
    path('summary/', views.expense_summary, name='expense_summary'),  # Expense summary
    path('signup/', views.signup, name='signup'),  # Signup route
]
urlpatterns = [
    path('expenses/', views.expense_list, name='expense_list'),  # List and create expenses
    path('expenses/<int:id>/', views.expense_detail, name='expense_detail'),  # Detail and update specific expense
]