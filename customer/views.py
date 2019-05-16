from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# Create your views here.

@login_required
def history(request):
    return render(request, 'customer_history.html')

@login_required
def flighthistory(request):
	return render(request,'flightcustomerhistory.html')
	
def user_register(request):
	return render(request,'register.html')
	
@login_required
def user_profile(request):
	return render(request,'profile.html')
	
def register(request):
	return render(request,'new_register.html')
	
def oper_register(request):
	return render(request,'oper_register.html')
	

	
	
from django.shortcuts import redirect	
def verify(request):
	if request.user.is_superuser:
		return render(request,'new_verify.html')
	else:
		return redirect('/hotel/')

def oper_view(request):
	return render(request,'oper_view.html')
	
def flight_register(request):
	return render(request,'flight_operator.html')
	
@login_required		
def hotel_verify(request):
	if request.user.is_superuser:
		return render(request,'hotel_verify.html')
	else:
		return redirect('/hotel/')

@login_required		
def flight_verify(request):
	if request.user.is_superuser:
		return render(request,'flight_verify.html')
	else:
		return redirect('/hotel/')
		
		
		

def home(request):
	return render(request,'home.html')