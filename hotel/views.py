from django.shortcuts import render

# Create your views here.

def hotel_search(request):
    
    return render(request, 'search.html')