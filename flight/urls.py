from django.urls import path, re_path
from . import views

urlpatterns = [
    path('', views.flight_search, name='flight_search'),

    path('bookingdetails/<transaction_id>/', views.flightbooking_details, name='flightbooking_details'),
    path('<id>/', views.flight_pages, name='flight_pages'),
    path('<id>/<category>/', views.flight_book, name='flight_book'),
    path('<flight_id>/<category>/booked/<transaction_id>/', views.flightbooking_confirmed, name='flightbooking_confirmed'),
    path('<flight_id>/<category>/canceled/', views.flightbooking_cancelled, name='flightbooking_cancelled'),

]