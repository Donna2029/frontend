from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Sum
from .models import Expense
from .serializers import ExpenseSerializer
from datetime import datetime
from rest_framework.decorators import api_view
from . import views  # Make sure this import is present
from .serializers import UserSignupSerializer
from rest_framework import status
from django.contrib.auth.models import User
# 1. List Expenses or Create an Expense
@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def expense_list(request):
    if request.method == 'GET':
        # Handle GET (list expenses)
        # (Same as before)
        pass

    elif request.method == 'POST':
        # Handle POST (create expense)
        # (Same as before)
        pass

@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def expense_detail(request, id):
    try:
        expense = Expense.objects.get(id=id)
    except Expense.DoesNotExist:
        return Response({"detail": "Expense not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        # Return a specific expense detail
        serializer = ExpenseSerializer(expense)
        return Response(serializer.data)

    elif request.method == 'PATCH':
        # Handle PATCH (update a specific expense)
        serializer = ExpenseSerializer(expense, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        # Handle DELETE (delete a specific expense)
        expense.delete()
        return Response({"detail": "Expense deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
# 2. Expense Summary (Total spent and category-wise breakdown)
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def expense_summary(request):
    expenses = Expense.objects.all()
    total_spent = expenses.aggregate(total=Sum('amount'))['total'] or 0
    category_summary = expenses.values('category').annotate(total=Sum('amount'))

    return Response({
        "total_spent": total_spent,
        "category_summary": category_summary
    })
from rest_framework_simplejwt.tokens import RefreshToken

@api_view(['POST'])
def signup(request):
    if request.method == 'POST':
        username = request.data.get("username")
        password = request.data.get("password")
        group_name = request.data.get("group_name")

        if not username or not password or not group_name:
            return Response({"detail": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Check if the username already exists
            if User.objects.filter(username=username).exists():
                return Response({"detail": f"Username '{username}' already exists."}, status=status.HTTP_400_BAD_REQUEST)

            user = User.objects.create_user(username=username, password=password)
            # You can add the group_name logic here if needed
            refresh = RefreshToken.for_user(user)
            
            # Send back the response with token
            return Response({
                'username': user.username,
                'refresh_token': str(refresh),
                'access_token': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            # Log the exception for debugging
            print(f"Error: {str(e)}")
            return Response({"detail": f"Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)