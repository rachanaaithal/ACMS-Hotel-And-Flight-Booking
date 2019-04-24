from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# Create your views here.

gst=5
cancellation_charges=5

def flight_search(request):
    return render(request, 'searchflight.html')

def flight_pages(request, id):
    print('list page', id)
    context={'id':id}
    return render(request, 'flight_detail.html', context)

@login_required
def flight_book(request, id, category):
    print('book_page',id, category)
    context={'id':id, 'category': category}
    return render(request, 'confirm_flightbooking.html', context)

@login_required
def flightbooking_confirmed(request, flight_id, category, transaction_id):
    print('booked_page:', flight_id, category, transaction_id)
    context={'flight_id':flight_id, 'category': category, 'transaction_id': transaction_id, 'gst': gst}
    return render(request, 'flightbooking_confirmed.html', context)

@login_required
def flightbooking_cancelled(request, flight_id, category):
    print('booked_page:', flight_id, category)
    context={'flight_id':flight_id, 'category': category}
    return render(request, 'flightbooking_cancelled.html', context)

@login_required
def flightbooking_details(request, transaction_id):
    print('booking_details:', transaction_id)
    context={'transaction_id':transaction_id,'gst': gst, 'cancellation_charges': cancellation_charges}
    return render(request,'flightbooking_details.html', context)