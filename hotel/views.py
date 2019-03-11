from django.shortcuts import render

# Create your views here.

def hotel_search(request):
    
    return render(request, 'search.html')

def hotel_pages(request, id):
    print('list page', id)
    context={'id':id}
    return render(request, 'hotel_detail.html', context)

def hotel_book(request, id):
    print('book_page',id)
    return render(request, 'confirm_booking.html')

def hotel_confirmbook(request, id, category):
    print('confirm', id, category)
    return render(request,'confirm_booking_cat.html')