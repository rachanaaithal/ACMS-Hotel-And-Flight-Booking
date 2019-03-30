from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# Create your views here.

@login_required
def history(request):
    return render(request, 'customer_history.html')
	
def user_register(request):
	return render(request,'register.html')