from django.urls import path, re_path
from . import views

urlpatterns = [
    path('', views.hotel_search, name='hotel_search'),
    path('<id>/', views.hotel_pages, name='hotel_pages'),
    path('<id>/book/', views.hotel_book, name='hotel_book'),
]