from django.urls import path
from . import views

urlpatterns = [

    path('', views.hotel_search, name='hotel_search'),
    path('<int:pk>', views.hotel_pages, name='hotel_pages'),
]