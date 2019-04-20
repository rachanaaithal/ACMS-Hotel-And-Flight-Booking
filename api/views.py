from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from api.serializers import UserSerializer, GroupSerializer, HotelSerializer, CountrySerializer, CitySerializer, HotelRoomSerializer, RoomTypeSerializer, RoomAvailabilitySerializer, HotelPhotosSerializer
from api.models import Country, City, Hotel, RoomType, HotelRoom, RoomAvailability, HotelPhotos, UserprofileInfo
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from django.http import JsonResponse
from django.db.models import Q
from django.core import serializers
import json
from rest_framework import generics
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from datetime import *
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from rest_framework.response import Response
from django.db.models import Max, Min

from django.contrib.auth import authenticate, login, logout, views

import random
class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class CountryViewSet(viewsets.ModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    filter_fields = {
        'name': ['exact']
    }

class CityViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    filter_fields = {
        'name': ['exact']
    }
    
class HotelViewSet(viewsets.ModelViewSet):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer
    filter_fields = {
        'name': ['exact'],
        'id': ['exact']
    }

class HotelRoomViewSet(viewsets.ModelViewSet):
    queryset = HotelRoom.objects.all()
    serializer_class = HotelRoomSerializer
    filter_fields = {
        'id': ['exact'],
        'hotel': ['exact'],
        'category': ['exact']   
    }

class MaxHotelRoomView(generics.ListCreateAPIView):
    #queryset = HotelRoom.objects.all()
    serializer_class = HotelRoomSerializer
    def get_queryset(self):
        city = self.request.GET.get("name",None)
        room_type= self.request.GET.get("type",None)
        room_type=room_type.split('|')
        print("\n\n\n\n\n\n\n\n\n\nn\nhere:",HotelRoom.objects.filter(category__name__in=room_type),"\n\nnow:",HotelRoom.objects.filter(hotel__city_name__name=city).filter(category__name__in=room_type),"\n\n")
        return HotelRoom.objects.filter(hotel__city_name__name=city).filter(category__name__in=room_type)
    def get(self, request, format=None):
        room=self.get_queryset().order_by('-price').first()
        serializer = HotelRoomSerializer(room)
        return Response(serializer.data)
class MinHotelRoomView(generics.ListCreateAPIView):
    #queryset = HotelRoom.objects.all()
    serializer_class = HotelRoomSerializer
    def get_queryset(self):
        city = self.request.GET.get("name",None)
        room_type= self.request.GET.get("type",None)
        room_type=room_type.split('|')
        return HotelRoom.objects.filter(hotel__city_name__name=city).filter(category__name__in=room_type)
    def get(self, request, format=None):
        room=self.get_queryset().order_by('-price').last()    
        serializer = HotelRoomSerializer(room)
        return Response(serializer.data)

'''
class Availability(generics.ListCreateAPIView):
    queryset = RoomAvailability.objects.all()
    serializer_class = RoomAvailabilitySerializer


class AvailabilityDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = RoomAvailability.objects.all()
    serializer_class = RoomAvailabilitySerializer
''' 

@method_decorator(csrf_exempt, name='dispatch')
class RoomAvailabilityViewSet(viewsets.ModelViewSet):
    #queryset = RoomAvailability.objects.all()
    serializer_class = RoomAvailabilitySerializer
    class Meta:
        depth=2
    filter_fields = {
        'room': ['exact'],
        'id': ['exact'],
        'booked_by': ['exact'],
    }
    def perform_create(self, serializer):
        serializer.save(booked_by=self.request.user)
    
    def get_queryset(self):
#This view should return a list of all the booking for the currently authenticated user.
        user = self.request.user
        return RoomAvailability.objects.filter(booked_by=user)

'''
class UpdateAvailability(generics.UpdateAPIView):
    queryset = RoomAvailability.objects.all()
    serializer_class = RoomAvailabilitySerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.status = request.data.get("status")
        instance.save()

        serializer = self.get_serializer(instance)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

class RoomAvailabilityDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = RoomAvailability.objects.all()
    serializer_class = RoomAvailabilitySerializer
'''
class RoomTypeViewSet(viewsets.ModelViewSet):
    queryset = RoomType.objects.all()
    serializer_class = RoomTypeSerializer
    filter_fields = {
        'name': ['exact'],
        'id': ['exact']
    }



'''
from rest_framework import generics
class SearchSet(viewsets.ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    filter_fields = {
        'name': ['exact']
    }
'''
def search(request):
    print(request.GET)
    name=request.GET.get("name",None)
    st=request.GET.get("start",None)
    ed=request.GET.get("end",None)
    type_room= request.GET.get("type",None)
    min_price= request.GET.get("minprice",None)
    max_price= request.GET.get("maxprice",None)
    page = request.GET.get('page', 1)
    st=st.strip()
    ed=ed.strip()
    if name is None or st is None or ed is None:
        return JsonResponse([], safe=False)

    if type_room is not None:
        type_room=type_room.split('|')
    print("\n\n\n\n\n\n\n\n\n",name,st,ed, type_room,min_price,max_price,page)
    print(min_price=='null')
    # city_results = Hotel.objects.filter(city_name__name=name)

    q1=Q(from_date__gte=st)
    q2=Q(from_date__lte=ed) 
    q3=Q(to_date__gte=st)
    q4=Q(to_date__lte=ed)
    q5=Q(from_date__lte=st)
    q6=Q(to_date__gte=ed)
    q7=Q(from_date__gte=st)
    q8=Q(to_date__lte=ed)
 

#Get Supply (Room type-hotel level)
    supply = HotelRoom.objects.filter(hotel__city_name__name=name).values('hotel__name', 'category__name', 'hotel__image_link', 'hotel__id','number_of_rooms', 'hotel__latitude', 'hotel__longitude','price')
    
#Get Demand from room availability table
    demand = RoomAvailability.objects.filter((q1 & q2) | (q3 & q4) | (q5 & q6)| (q7 & q8)).filter(room__hotel__city_name__name=name)
    demand = demand.exclude(status='dd').values('room__hotel__name','room__category__name','status','room__price')
   
    if type_room is not None:
        supply=supply.filter(category__name__in=type_room)
        demand=demand.filter(room__category__name__in=type_room)
    
    if min_price is not None and min_price !='null':
        supply= supply.filter(Q(price__gte=min_price))
        demand= demand.filter(Q(room__price__gte=min_price))
    if max_price is not None and max_price !='null':
        supply= supply.filter(Q(price__lte=max_price))
        demand= demand.filter(Q(room__price__lte=max_price))
    
    #print('demand:',list(demand.values('room__hotel__name','room__category__name', 'status')) )
    demand = [x['room__hotel__name']+':'+x['room__category__name']+x['status'] for x in list(demand)]
    demand_dict = {}
    for dem in demand:
        if dem in demand_dict:
            demand_dict[dem]+=1
        else:
            demand_dict[dem]=1

#To make the query set into a dictionary
    response = {}
    for result in list(supply):
        #if room exists to book
        checkKey = result['hotel__name']+':'+result['category__name']
        if checkKey in demand_dict:
            rooms_actually_available = result['number_of_rooms'] - demand_dict[checkKey]
            if rooms_actually_available==0:
                continue
        else:
            rooms_actually_available = result['number_of_rooms']

        
        #if new hotel name
        if result['hotel__name'] not in response:

            images=HotelPhotos.objects.filter(hotel__name=result['hotel__name']).values('image_link')
            images=[x['image_link'] for x in list(images)]
            print("\n\n\n\n",images,"\n\n\n\n\n\n")
            
            response[result['hotel__name']] = {}
            #response[result['hotel__name']]['image_link']=result['hotel__image_link']
            response[result['hotel__name']]['image_link']=random.choice(list(images))
            response[result['hotel__name']]['room_types']={}
            response[result['hotel__name']]['hotel_id']=result['hotel__id'] 
            response[result['hotel__name']]['latitude']=result['hotel__latitude']
            response[result['hotel__name']]['longitude']=result['hotel__longitude']
        response[result['hotel__name']]['room_types'][result['category__name']] = rooms_actually_available

    
    #making into json
    response = [{'hotel':key, 'room_types':response[key]['room_types'], 'image_link':response[key]['image_link'], 'hotel_id':response[key]['hotel_id'], 'latitude': response[key]['latitude'], 'longitude': response[key]['longitude']} for key in response]
    print('\n\nresponse',response,len(response),type(response))

    
    print(page)
    paginator = Paginator(response, 6)
    try:
        print('try')
        response_page = paginator.page(page)
    except PageNotAnInteger:
        print('except1')
        response_page = paginator.page(1)
    except EmptyPage:
        print('except2')
        response_page = paginator.page(paginator.num_pages)

    print('\n\n\n',list(response_page),response_page.number, response_page.paginator.num_pages)
    if response_page.has_next():
        print('\n\nhas next',response_page.next_page_number())
        next_page=response_page.next_page_number()
    else:
        next_page=0
    if response_page.has_previous():
        print('\n\nhas previous',response_page.previous_page_number())
        prev_page=response_page.previous_page_number()
    else:
        prev_page=0
    paginated_response={'response':list(response_page),'has_next':response_page.has_next(),'next_page':next_page,'has_prev':response_page.has_previous(),'prev_page':prev_page}
    #return JsonResponse(response, safe=False)
    return JsonResponse(paginated_response, safe=False)
    #return Response({response_page})
def check(request):
    name=request.GET["name"]
    st=request.GET["start"]
    ed=request.GET["end"]
    category=request.GET["category"]
    st=st.strip()
    ed=ed.strip()

    q1=Q(from_date__gte=st)
    q2=Q(from_date__lte=ed) 
    q3=Q(to_date__gte=st)
    q4=Q(to_date__lte=ed)
    q5=Q(from_date__lte=st)
    q6=Q(to_date__gte=ed)
    q7=Q(from_date__gte=st)
    q8=Q(to_date__lte=ed)

#Get Supply (Room type-hotel level)
    supply = HotelRoom.objects.filter(hotel__id=name).filter(category__id=category).values('id','hotel__name', 'category__id', 'hotel__image_link', 'hotel__id','number_of_rooms')
    
#Get Demand from room availability table
    demand = RoomAvailability.objects.filter((q1 & q2) | (q3 & q4) | (q5 & q6)| (q7 & q8)).filter(room__hotel__id=name).filter(room__category__id=category)

    #print('checking',list(supply)[0]['id'],demand)
    if((list(supply)[0]['number_of_rooms']-len(list(demand)))>0):
        response={'val':True, 'id':list(supply)[0]['id']}
    else:
        response={'val':False}

    return JsonResponse(response, safe=False)

class HotelPhotosViewSet(viewsets.ModelViewSet):
    queryset = HotelPhotos.objects.all()
    serializer_class = HotelPhotosSerializer
    filter_fields = {
        'hotel': ['exact'],
    }



from django.shortcuts import redirect	
def register(request):
	username=request.GET["username"]
	password=request.GET["password"]
	fname = request.GET["fname"]
	lname = request.GET["lname"]
	email = request.GET["email"]
	phno = request.GET["phno"]
	
	user = User(username=username,password=password,first_name=fname,last_name=lname,email=email)
	user.set_password(user.password)
	user.save()
	role="User"
	profile = UserprofileInfo(user=user,phone_number=phno,role=role)
	profile.save()
	login(request,user,backend='django.contrib.auth.backends.ModelBackend')
	return redirect('/hotel/')
	
from api.serializers import User1Serializer,UserProfileSerializer

@method_decorator(csrf_exempt, name='dispatch')	
class User1ViewSet(viewsets.ModelViewSet):
    #queryset = User.objects.all().order_by('-date_joined')
	serializer_class = User1Serializer
	def perform_create(self, serializer):
		serializer.save(username=self.request.user)
	def get_queryset(self):
		user=self.request.user
		return User.objects.filter(username=user)
	
@method_decorator(csrf_exempt, name='dispatch')	
class UserProfileViewSet(viewsets.ModelViewSet):
    #queryset = User.objects.all().order_by('-date_joined')
	serializer_class = UserProfileSerializer
	def perform_create(self, serializer):
		serializer.save(user=self.request.user)
	def get_queryset(self):
		user=self.request.user
		return UserprofileInfo.objects.filter(user=user)
		
def edit(request):
	fname = request.GET["fname"]
	lname = request.GET["lname"]
	email = request.GET["email"]
	phno = request.GET["phno"]
	
	u = User.objects.get(id=request.user.id)
	u.first_name=fname
	u.last_name=lname
	u.email=email
	u.save()
	pro = UserprofileInfo.objects.get(user=request.user)
	pro.phone_number=phno
	pro.save()
	return redirect('/hotel/')
