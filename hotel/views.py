from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# Create your views here.

def hotel_search(request):
    
    return render(request, 'search.html')

def hotel_pages(request, id):
    print('list page', id)
    context={'id':id}
    return render(request, 'hotel_detail.html', context)

@login_required
def hotel_book(request, id, category):
    print('book_page',id, category)
    context={'id':id, 'category': category}
    return render(request, 'confirm_booking.html', context)

@login_required
def booking_confirmed(request, hotel_id, category, transaction_id):
    print('booked_page:', hotel_id, category, transaction_id)
    context={'hotel_id':hotel_id, 'category': category, 'transaction_id': transaction_id}
    return render(request, 'booking_confirmed.html', context)

@login_required
def booking_cancelled(request, hotel_id, category):
    print('booked_page:', hotel_id, category)
    context={'hotel_id':hotel_id, 'category': category}
    return render(request, 'booking_cancelled.html', context)