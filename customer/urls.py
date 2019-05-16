from django.urls import path, re_path
from . import views
from django.conf.urls import url,include

urlpatterns = [
    path('', views.history, name='history'),
    path('flighthistory',views.flighthistory,name='flighthistory'),
	
	url(r'user_register',views.user_register, name = 'user_register'),
	url(r'oper_register',views.oper_register,name='oper_register'),
	
	url(r'flight_register',views.flight_register,name='flight_register'),
	
	url(r'register',views.register, name = 'register'),

	url(r'oper_view', views.oper_view, name="oper_view"),
	url(r'home',views.home, name="home")
]

urlpatterns+=[url(r'profile',views.user_profile,name='user_profile'),]

urlpatterns+=[url(r'hotel_verify',views.hotel_verify,name='hotel_verify'),]
urlpatterns+=[url(r'flight_verify',views.flight_verify,name='flight_verify'),]

urlpatterns+=[url(r'verify',views.verify,name='verify'),]