from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# Create your views here.

@login_required
def history(request):
    return render(request, 'customer_history.html')
	
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
		return render(request,'verify.html')
	else:
		return redirect('/hotel/')