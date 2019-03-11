from django.shortcuts import render

# Create your views here.

def hotel_search(request):
    
    return render(request, 'search.html')

def hotel_pages(request, id):
    print('list page', id)
    context={'id':id}
    return render(request, 'hotel_detail.html', context)

def hotel_book(request, id, category):
    print('book_page',id, category)
    context={'id':id, 'category': category}
    return render(request, 'confirm_booking.html', context)
