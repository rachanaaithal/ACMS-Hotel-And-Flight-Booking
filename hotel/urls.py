from django.urls import path, re_path
from . import views

urlpatterns = [
    path('', views.hotel_search, name='hotel_search'),
    path('bookingdetails/<transaction_id>/', views.booking_details, name='booking_details'),
    path('<id>/', views.hotel_pages, name='hotel_pages'),
    path('<id>/<category>/', views.hotel_book, name='hotel_book'),
    path('<hotel_id>/<category>/booked/<transaction_id>/', views.booking_confirmed, name='booking_confirmed'),
    path('<hotel_id>/<category>/canceled/', views.booking_cancelled, name='booking_cancelled'),
]