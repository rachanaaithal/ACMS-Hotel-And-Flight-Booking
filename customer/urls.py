from django.urls import path, re_path
from . import views
from django.conf.urls import url,include

urlpatterns = [
    path('', views.history, name='history'),
	url(r'register',views.user_register, name = 'user_register'),
]