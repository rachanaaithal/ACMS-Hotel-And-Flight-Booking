from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from api.serializers import UserSerializer, GroupSerializer, HotelSerializer, CountrySerializer, CitySerializer, HotelRoomSerializer, RoomTypeSerializer, RoomAvailabilitySerializer, HotelPhotosSerializer
from api.models import Country, City, Hotel, RoomType, HotelRoom, RoomAvailability, HotelPhotos, UserprofileInfo
from api.serializers import Seat_AvailabilitySerializer, SeatTypeSerializer, FlightSerializer, Flight_SeatsSerializer
from api.models import Seat_Availability, Flight, Flight_Seats, SeatType
from api.serializers import UserSerializer, GroupSerializer, HotelSerializer, CountrySerializer, CitySerializer, HotelRoomSerializer, RoomTypeSerializer, RoomAvailabilitySerializer, HotelPhotosSerializer, OperatorSerializer
from api.models import Country, City, Hotel, RoomType, HotelRoom, RoomAvailability, HotelPhotos, UserprofileInfo, Operator
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
import math

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
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
    serializer_class = HotelRoomSerializer
    def get_queryset(self):
        city = self.request.GET.get("name",None)
        room_type= self.request.GET.get("type",None)
        room_type=room_type.split('|')
        return HotelRoom.objects.filter(hotel__city_name__name=city).filter(category__name__in=room_type)
    def get(self, request, format=None):
        room=self.get_queryset().order_by('-base_price').first()
        serializer = HotelRoomSerializer(room)
        return Response(serializer.data)
class MinHotelRoomView(generics.ListCreateAPIView):
    serializer_class = HotelRoomSerializer
    def get_queryset(self):
        city = self.request.GET.get("name",None)
        room_type= self.request.GET.get("type",None)
        room_type=room_type.split('|')
        return HotelRoom.objects.filter(hotel__city_name__name=city).filter(category__name__in=room_type)
    def get(self, request, format=None):
        room=self.get_queryset().order_by('-base_price').last()    
        serializer = HotelRoomSerializer(room)
        return Response(serializer.data)

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
        user = self.request.user
        return RoomAvailability.objects.filter(booked_by=user).exclude(status='dd')

class RoomTypeViewSet(viewsets.ModelViewSet):
    queryset = RoomType.objects.all()
    serializer_class = RoomTypeSerializer
    filter_fields = {
        'name': ['exact'],
        'id': ['exact']
    }

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

    q1=Q(from_date__gte=st)
    q2=Q(from_date__lte=ed) 
    q3=Q(to_date__gte=st)
    q4=Q(to_date__lte=ed)
    q5=Q(from_date__lte=st)
    q6=Q(to_date__gte=ed)
    q7=Q(from_date__gte=st)
    q8=Q(to_date__lte=ed)

    supply = HotelRoom.objects.filter(hotel__city_name__name=name).values('hotel__name', 'category__name', 'hotel__image_link', 'hotel__id','number_of_rooms', 'hotel__latitude', 'hotel__longitude','base_price')
    
    demand = RoomAvailability.objects.filter((q1 & q2) | (q3 & q4) | (q5 & q6)| (q7 & q8)).filter(room__hotel__city_name__name=name)
    demand = demand.exclude(status='dd').values('room__hotel__name','room__category__name','status','room__base_price')
   
    if type_room is not None:
        supply=supply.filter(category__name__in=type_room)
        demand=demand.filter(room__category__name__in=type_room)
    if min_price is not None and min_price !='null' and min_price !='undefined':
        supply= supply.filter(Q(base_price__gte=min_price))
        demand= demand.filter(Q(room__base_price__gte=min_price))
    if max_price is not None and max_price !='null' and max_price !='undefined':
        supply= supply.filter(Q(base_price__lte=max_price))
        demand= demand.filter(Q(room__base_price__lte=max_price))
    
    #print('demand:',list(demand.values('room__hotel__name','room__category__name', 'status')) )

    demand = [x['room__hotel__name']+':'+x['room__category__name']+x['status'] for x in list(demand)]
    demand_dict = {}
    for dem in demand:
        if dem in demand_dict:
            demand_dict[dem]+=1
        else:
            demand_dict[dem]=1

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

        if result['hotel__name'] not in response:

            images=HotelPhotos.objects.filter(hotel__name=result['hotel__name']).values('image_link')
            images=[x['image_link'] for x in list(images)]
            print("\n\n\n\n",images,"\n\n\n\n\n\n")
            
            response[result['hotel__name']] = {}
            response[result['hotel__name']]['image_link']=random.choice(list(images))
            response[result['hotel__name']]['room_types']={}
            response[result['hotel__name']]['hotel_id']=result['hotel__id'] 
            response[result['hotel__name']]['latitude']=result['hotel__latitude']
            response[result['hotel__name']]['longitude']=result['hotel__longitude']
        response[result['hotel__name']]['room_types'][result['category__name']] = rooms_actually_available

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
    return JsonResponse(paginated_response, safe=False)
    #return Response({response_page})

def check(request):
    name=request.GET.get("name",None)
    st=request.GET.get("start",None)
    ed=request.GET.get("end",None)
    category=request.GET.get("category",None)
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

    supply = HotelRoom.objects.filter(hotel__id=name).filter(category__id=category).values('id','hotel__name', 'category__id', 'hotel__image_link', 'hotel__id','number_of_rooms')
    
    demand = RoomAvailability.objects.filter((q1 & q2) | (q3 & q4) | (q5 & q6)| (q7 & q8)).filter(room__hotel__id=name).filter(room__category__id=category)
    demand = demand.exclude(status='dd').values('room__hotel__name','room__category__name','status','room__base_price')

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

def prices(request):
    name=request.GET.get("name",None)
    st=request.GET.get("start",None)
    ed=request.GET.get("end",None)
    category=request.GET.get("category",None)    
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

#Get Supply
    supply = HotelRoom.objects.filter(hotel__id=name).values('hotel__name', 'category__name', 'hotel__image_link', 'hotel__id','number_of_rooms', 'hotel__latitude', 'hotel__longitude','base_price','max_price')
    supply_type = supply.filter(category__id=category)

    base_price = float(list(supply_type)[0]['base_price'])
    max_price = float(list(supply_type)[0]['max_price'])

    supply = list(supply)[0]['number_of_rooms']
    supply_type = list(supply_type)[0]['number_of_rooms']

#Get Demand from room availability table
    demand = RoomAvailability.objects.filter((q1 & q2) | (q3 & q4) | (q5 & q6)| (q7 & q8)).filter(room__hotel__id=name)
    demand = demand.exclude(status='dd').values('room__hotel__name','room__category__name','status','room__base_price')
    demand_type = demand.filter(room__category__id=category)

    demand = len(list(demand))
    demand_type = len(list(demand_type))

    #a is the number of days left
    d0 = datetime.today().strftime('%Y-%m-%d')
    d0 = datetime.strptime(d0, '%Y-%m-%d')
    d1 = datetime.strptime(st, '%Y-%m-%d')
    d2 = datetime.strptime(ed, '%Y-%m-%d')
    delta1 = d1 - d0
    a = delta1.days
    if a<30:
	    a = 1-(a/30)
    else:
    	a = 0

    #b is total % of rooms of this type booked in this hotel
    b = (supply_type-demand_type)/supply_type
    b = 1-b

    #c is total % of rooms of other types booked in this hotel
    if supply-supply_type >0: 
        c = ((supply-supply_type)-(demand-demand_type)/(supply-supply_type))
        c = 1-c
    else:
        c = b

    delta2 = d2-d1
    num_of_days=max(delta2.days,1)
    price = (0.3*(a)+0.4*(b)+0.3*(c))*(max_price-base_price)+base_price
    price=round(price/50)*50
    print(base_price,max_price,a,b,c)
    response={'price':(price*num_of_days)}

    return JsonResponse(response, safe=False)

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
	serializer_class = User1Serializer
	def perform_create(self, serializer):
		serializer.save(username=self.request.user)
	def get_queryset(self):
		user=self.request.user
		return User.objects.filter(username=user)
	
@method_decorator(csrf_exempt, name='dispatch')	
class UserProfileViewSet(viewsets.ModelViewSet):
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
	
class CityListViewSet(viewsets.ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer
	
from api.models import Registered_Hotel,Registered_HotelPhotos , Registered_Rooms
from datetime import datetime
def oper_register(request):
	name = request.GET["name"]
	city = request.GET["city"]
	add = request.GET["add"]
	ct = request.GET["ct"]
	et =request.GET["et"]
	lat = request.GET["lat"]
	long = request.GET['long']
	email = request.GET['email']
	phno = request.GET['phno']
	count = request.GET['count']
	room_count = request.GET['room_count']
	room_count = int(room_count)
	count = int(count)
	print (city)
	city_name = City.objects.get(name=city)
	#c = city_name.values("id")
	#print(c[0]['id'])
	t = datetime.strptime(ct, '%H:%M')
	print(t)
	et =int(et)
	et = timedelta(minutes=et)
	print(et)
	hotel = Registered_Hotel(name=name ,city_name=city_name,address = add,checkintime=t,extratime=et, latitude = lat, longitude=long,email=email,phone_number=phno,count = count)
	hotel.save()
	for i in range(1,count+1):
		j = "img"+str(i)
		photos = Registered_HotelPhotos(hotel=hotel,image_link = request.GET[j])
		photos.save()
	for i in range(1,room_count+1):
		room_type = RoomType.objects.get(name=request.GET['roomtype'+str(i)])
		
		#here
		room = Registered_Rooms(hotel=hotel,capacity = request.GET['capacity'+str(i)],description = request.GET['description'+str(i)],category=room_type,base_price=request.GET['bprice'+str(i)],max_price=request.GET['mprice'+str(i)],number_of_rooms=request.GET['no_rooms'+str(i)])
		
		
		room.save();
	return redirect('/hotel/')

from api.serializers import NewHotelSerializer, Hotel_Serializer

class NewHotelViewSet(viewsets.ModelViewSet):
    queryset = Registered_Hotel.objects.all()
    serializer_class = NewHotelSerializer
	
class Hotels_ViewSet(viewsets.ModelViewSet):
	queryset = Hotel.objects.all()
	serializer_class = Hotel_Serializer
	
import random
import string
def randomString(stringLength=8):
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(stringLength))
	
from api.models import Operator,HotelPhotos

def add_oper(request):
	'''name = request.GET["name"]
	city = request.GET["city"]
	add = request.GET["add"]
	ct = request.GET["ct"]
	hr=request.GET["hr"]
	min = request.GET["min"]
	sec = request.GET["sec"]
	lat = request.GET["lat"]
	long = request.GET["longi"]
	email = request.GET["email"]
	phno = request.GET["phno"]
	count = request.GET["count"]
	count = int(count)'''
	id = request.GET['id'];
	hotel1 = Registered_Hotel.objects.filter(id=id).values('id','name','city_name','address','checkintime','extratime','latitude','longitude','email','phone_number','count')
	#Add to hotel Table
	print (hotel1[0])
	#print()
	c =City.objects.get(id=hotel1[0]['city_name'])
	name = hotel1[0]['name']
	email = hotel1[0]['email']
	hotel =Hotel(name=hotel1[0]['name'] ,city_name=c,address = hotel1[0]['address'],checkintime=hotel1[0]['checkintime'],extratime=hotel1[0]['extratime'], latitude = hotel1[0]['latitude'], longitude=hotel1[0]['longitude'])
	hotel.save()
	password = randomString()
	print(password)
	#delete from the registered table
	#hotel2 = Registered_Hotel.objects.filter(name=name).values('id')
	new_photos = Registered_HotelPhotos.objects.filter(hotel=hotel1[0]['id']).values('image_link')
	print(new_photos)
	for i in range(0,hotel1[0]['count']):
		print("what")
		print(new_photos[i])
		photo = HotelPhotos(hotel = hotel,image_link = new_photos[i]['image_link'])
		photo.save()
	
	#here
	new_rooms  = Registered_Rooms.objects.filter(hotel=hotel1[0]['id']).values('capacity','description','category','base_price','max_price','number_of_rooms')
	
	
	for i in range(0,len(new_rooms)):
		t = RoomType.objects.get(id=new_rooms[i]['category'])
		
		#here
		rooms = HotelRoom(hotel=hotel,capacity = new_rooms[i]['capacity'],description=new_rooms[i]['description'],category = t,base_price = new_rooms[i]['base_price'],max_price = new_rooms[i]['max_price'],number_of_rooms=new_rooms[i]['number_of_rooms'])
		
		rooms.save()
	user = User(username=hotel1[0]['email'],password=password,email=hotel1[0]['email'])
	user.set_password(user.password)
	user.save()
	role = "Hotel Operator"
	profile = Operator(user=user,hotel=hotel,phone_number=hotel1[0]['phone_number'],role=role)
	profile.save()
	hotel2 = Registered_Hotel.objects.get(id=id)
	hotel2.delete()
	email_operator(name,email,password,"hotel")
	return redirect('/customer/verify/')

import smtplib, ssl

def email_operator(name,email,password,type):
	message = """Subject: Registration Successful

	Hi {name}, your {type} is successfully registered for Book Now!!
	Username : {email}
	Password : {password}
	Now you can update your detail @ Book Now
	Please do not share your password"""
	from_address = "acmsbooknow@gmail.com"
	sender_password = "acms1234"
	
	context = ssl.create_default_context()
	with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
		server.login(from_address, sender_password)
		server.sendmail(
			from_address,
			email,
			message.format(name=name,email=email,password=password,type=type),
		)

def email_hotel_booking(name,email,hotel_name,address,in_date,out_date,total,type):
    message = """Subject: Booking Successful

    Hi {name}, your hotel booking is successfully!!
    Hotel Name : {hotel_name}
    Address: {address}
    Checkin Date : {in_date}
    Checkout Date :{out_date}
    Price : {total}
    Room Type : {type}
    Thank you for booking"""
    from_address = "acmsbooknow@gmail.com"
    sender_password = "acms1234"
    
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(from_address, sender_password)
        server.sendmail(
            from_address,
            email,
            message.format(name=name,email=email,hotel_name=hotel_name,address=address,in_date=in_date,out_date=out_date,total=total,type=type),
        )

def email_flight_booking(name,email,airline_name,source,destination,takeoff_time,landing_time,on_date,total,type):
    message = """Subject: Booking Successful
    Hi {name}, your flight booking is successfully!!
    Airline : {airline_name}
    From: {source}
    To: {destination}
    Takeoff: {takeoff_time}
    Landing: {landing_time}
    Date :{on_date}
    Price : {total}
    Seat Type : {type}
    Thank you for booking"""
    from_address = "acmsbooknow@gmail.com"
    sender_password = "acms1234"
    
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(from_address, sender_password)
        server.sendmail(
            from_address,
            email,
            message.format(name=name,email=email,airline_name=airline_name,source=source,destination=destination,takeoff_time=takeoff_time,landing_time=landing_time,on_date=on_date,total=total,type=type),
        )

def booking_mail(request):
    id = request.GET['id']
    sts = RoomAvailability.objects.filter(id=id).values('room__category__name','room__hotel__name','room__hotel__address','from_date','to_date','booked_by__first_name','booked_by__email')
    in_date = sts[0]['from_date']
    out_date = sts[0]['to_date']
    type = sts[0]['room__category__name']
    hotel_name = sts[0]['room__hotel__name']
    address = sts[0]['room__hotel__address']
    total = request.GET['total']
    name = sts[0]['booked_by__first_name']
    email=sts[0]['booked_by__email']
    email_hotel_booking(name,email,hotel_name,address,in_date,out_date,total,type)
    response = {'val':True}
    return JsonResponse(response,safe=False)

def flights_mails(request):
    id = request.GET['id']
    sts = Seat_Availability.objects.filter(id=id).values('seat__flight__airline_name','seat__category__name','seat__flight__source__name','seat__flight__takeoff_time','seat__flight__landing_time','seat__flight__destination__name','on_date','booked_by__first_name','booked_by__email','seat__flight__flightnumber')
    on_date = sts[0]['on_date']
    type = sts[0]['seat__category__name']
    airline_name = sts[0]['seat__flight__airline_name']
    source = sts[0]['seat__flight__source__name']
    destination=sts[0]['seat__flight__destination__name']
    takeoff_time=sts[0]['seat__flight__takeoff_time']
    landing_time=sts[0]['seat__flight__landing_time']
    total = request.GET['total']
    name = sts[0]['booked_by__first_name']
    email=sts[0]['booked_by__email']
    email_flight_booking(name,email,airline_name,source,destination,takeoff_time,landing_time,on_date,total,type)
    response = {'val':True}
    return JsonResponse(response,safe=False)

class OperatorViewSet(viewsets.ModelViewSet):
    queryset = Operator.objects.all()
    serializer_class = OperatorSerializer
    filter_fields = {
        'hotel': ['exact'],
        'user':['exact']
    }
    def perform_create(self, serializer):
        serializer.save(booked_by=self.request.user)

class FlightViewSet(viewsets.ModelViewSet):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer
    filter_fields={
        'id' : ['exact'],
        'flightnumber' : ['exact'],
        'airline_name' : ['exact'],
        'source' : ['exact'],
        'destination' : ['exact'],
        'on_date' : ['exact']
    }
    
class Flight_SeatsViewSet(viewsets.ModelViewSet):
    queryset = Flight_Seats.objects.all()
    serializer_class = Flight_SeatsSerializer
    filter_fields={
        'id' : ['exact'],
        'category' : ['exact'],
        'seat_position' : ['exact'],
        'flight' : ['exact']
    }
    
class SeatTypeViewSet(viewsets.ModelViewSet):
    queryset = SeatType.objects.all()
    serializer_class = SeatTypeSerializer
    filter_fields = {
        'name': ['exact'],
        'id': ['exact']
    }  

@method_decorator(csrf_exempt, name='dispatch')
class Seat_AvailabilityViewSet(viewsets.ModelViewSet):
    serializer_class = Seat_AvailabilitySerializer
    class Meta:
        depth=2
    filter_fields={
        'seat':['exact'],
        'id':['exact'],
        'booked_by':['exact']
    }
    def perform_create(self, serializer):
        serializer.save(booked_by=self.request.user)

    def get_queryset(self):
        user=self.request.user
        return Seat_Availability.objects.filter(booked_by=user)

def sflights(request):
    source=request.GET.get("source",None)
    st=request.GET.get("start",None)
    destination=request.GET.get("destination",None)
    type_seat= request.GET.get("type",None)
    min_price= request.GET.get("minprice",None)
    max_price= request.GET.get("maxprice",None)
    page = request.GET.get('page', 1)
    st=st.strip()
    if source is None or st is None or destination is None:
        return JsonResponse([], safe=False)

    if type_seat is not None:
        type_seat=type_seat.split('|')
    st=datetime.strptime(st, "%Y-%m-%d").date()

    q1=Q(flight__on_date__day=st.day)
    q2=Q(flight__source__name=source)
    q3=Q(flight__destination__name=destination)
    q4=Q(seat__flight__source__name=source)
    q5=Q(seat__flight__destination__name=destination)
    q6=Q(on_date__day=st.day)
    supply = Flight_Seats.objects.filter(q2).filter(q3).filter(q1).values('flight__id','flight__airline_name', 'category__name', 'flight__image_link', 'flight__flightnumber','flight__on_date','seat_position','number_of_seats','flight__takeoff_time', 'flight__landing_time','base_price')
    
    demand = Seat_Availability.objects.filter(q4).filter(q5).filter(q6)
    demand = demand.exclude(status='dd').values('seat__flight__airline_name','seat__category__name','seat__seat_position','status', 'on_date','seat__base_price')

    if type_seat is not None:
        supply=supply.filter(category__name__in=type_seat)
        demand=demand.filter(seat__category__name__in=type_seat)

    if min_price is not None and min_price !='null' and min_price !='undefined':
        supply= supply.filter(Q(base_price__gte=min_price))
        demand= demand.filter(Q(seat__base_price__gte=min_price))
    if max_price is not None and max_price !='null' and max_price !='undefined':
        supply= supply.filter(Q(base_price__lte=max_price))
        demand= demand.filter(Q(seat__base_price__lte=max_price))

    demand = [x['seat__flight__airline_name']+':'+x['seat__category__name']+x['seat__seat_position'] for x in list(demand)]
    demand_dict = {}
    for dem in demand:
        if dem in demand_dict:
            demand_dict[dem]+=1
        else:
            demand_dict[dem]=1
    response = {}
    for result in list(supply):
        checkKey = result['flight__airline_name']+':'+result['category__name']+result['seat_position']
        if checkKey in demand_dict:
            seats_actually_available = result['number_of_seats'] - demand_dict[checkKey]
            if seats_actually_available==0:
                continue
        else:
            seats_actually_available = result['number_of_seats']

        if result['flight__airline_name'] not in response:
            response[result['flight__airline_name']] = {}
            response[result['flight__airline_name']]['image_link']=result['flight__image_link']
            response[result['flight__airline_name']]['date']=result['flight__on_date']
            response[result['flight__airline_name']]['seat_position']={}
            response[result['flight__airline_name']]['flight_id']=result['flight__id']
            response[result['flight__airline_name']]['category']=result['category__name']
            response[result['flight__airline_name']]['flightnumber']=result['flight__flightnumber'] 
            response[result['flight__airline_name']]['takeoff_time']=result['flight__takeoff_time']
            response[result['flight__airline_name']]['landing_time']=result['flight__landing_time']
            response[result['flight__airline_name']]['source']=source
            response[result['flight__airline_name']]['destination']=destination
        elif result['flight__id'] not in response[result['flight__airline_name']]:
            response[result['flight__airline_name']] = {}
            response[result['flight__airline_name']]['date']=result['flight__on_date']
            response[result['flight__airline_name']]['image_link']=result['flight__image_link']
            response[result['flight__airline_name']]['seat_position']={}
            response[result['flight__airline_name']]['flight_id']=result['flight__id']
            response[result['flight__airline_name']]['category']=result['category__name']
            response[result['flight__airline_name']]['flightnumber']=result['flight__flightnumber'] 
            response[result['flight__airline_name']]['takeoff_time']=result['flight__takeoff_time']
            response[result['flight__airline_name']]['landing_time']=result['flight__landing_time']
            response[result['flight__airline_name']]['source']=source
            response[result['flight__airline_name']]['destination']=destination
        response[result['flight__airline_name']]['seat_position'][result['seat_position']] = seats_actually_available

    response = [{'flight':key, 'seat_position':response[key]['seat_position'], 'source':response[key]['source'], 'destination':response[key]['destination'],'image_link':response[key]['image_link'], 'flight_id':response[key]['flight_id'],'on_date':response[key]['date'],'flightnumber':response[key]['flightnumber'], 'category':response[key]['category'], 'takeoff_time':response[key]['takeoff_time'], 'landing_time':response[key]['landing_time']} for key in response]
    paginator = Paginator(response, 6)
    try:
        response_page = paginator.page(page)
    except PageNotAnInteger:
        response_page = paginator.page(1)
    except EmptyPage:
        response_page = paginator.page(paginator.num_pages)

    if response_page.has_next():
        next_page=response_page.next_page_number()
    else:
        next_page=0
    if response_page.has_previous():
        prev_page=response_page.previous_page_number()
    else:
        prev_page=0
    paginated_response={'response':list(response_page),'has_next':response_page.has_next(),'next_page':next_page,'has_prev':response_page.has_previous(),'prev_page':prev_page}

    return JsonResponse(paginated_response, safe=False)


def cflightstatus(request):
    source=request.GET["source"]
    destination=request.GET["destination"]
    st=request.GET["start"]
    seat_id=request.GET["seat_id"]
    flight_id=request.GET["flightid"]
    category=request.GET["category"]
    st=st.strip()
    st=datetime.strptime(st, "%Y-%m-%d").date()

    q4=Q(seat__flight__source__name=source)
    q5=Q(seat__flight__destination__name=destination)
    q6=Q(on_date__day=st.day)


    supply = Flight_Seats.objects.filter(id=seat_id).filter(flight__id=flight_id).filter(category__id=category).values('id','flight__id','flight__airline_name', 'category__name', 'flight__image_link', 'flight__flightnumber','flight__on_date','seat_position','number_of_seats','flight__takeoff_time', 'flight__landing_time')
    

    demand = Seat_Availability.objects.filter(q4).filter(q5).filter(q6).filter(seat__id=seat_id).filter(seat__flight__id=flight_id).filter(seat__category__id=category).values('seat__flight__airline_name','seat__category__name','seat__seat_position','status', 'on_date','seat__base_price')

    if((list(supply)[0]['number_of_seats']-len(list(demand)))>0):
        response={'val':True, 'id':list(supply)[0]['id']}
    else:
        response={'val':False}

    return JsonResponse(response, safe=False)

def flightcharges(request):
    flight_id=request.GET.get("flightid",None)
    source=request.GET.get("source",None)
    st=request.GET.get("start",None)
    destination=request.GET.get("destination",None)
    category=request.GET.get("category",None)    
    st=st.strip()
    st=datetime.strptime(st, "%Y-%m-%d").date()

    q1=Q(flight__on_date__day=st.day)
    q2=Q(flight__source__name=source)
    q3=Q(flight__destination__name=destination)
    q4=Q(seat__flight__source__name=source)
    q5=Q(seat__flight__destination__name=destination)
    q6=Q(on_date__day=st.day)
 
#Get Supply
    supply = Flight_Seats.objects.filter(q1).filter(q2).filter(q3).filter(flight__id=flight_id).values('flight__id','flight__airline_name', 'category__name', 'flight__flightnumber','flight__on_date','seat_position','number_of_seats','flight__takeoff_time', 'flight__landing_time','base_price','max_price')
    supply_type = supply.filter(category__id=category)

    base_price = float(list(supply_type)[0]['base_price'])
    max_price = float(list(supply_type)[0]['max_price'])

    supply = list(supply)[0]['number_of_seats']
    supply_type = list(supply_type)[0]['number_of_seats']

    demand = Seat_Availability.objects.filter((q6) | (q5)| (q4)).filter(seat__flight__id=flight_id)
    demand = demand.exclude(status='dd').values('seat__flight__airline_name','seat__category__name','seat__seat_position','status', 'on_date','seat__base_price')
    demand_type = demand.filter(seat__category__id=category)

    demand = len(list(demand))
    demand_type = len(list(demand_type))

    #a is the number of days left
    d0 = datetime.today().strftime('%Y-%m-%d')
    d0 = datetime.strptime(d0, '%Y-%m-%d')
    d1 = datetime.strptime(str(st), '%Y-%m-%d')
    delta1 = d1 - d0
    a = delta1.days
    if a<30:
        a = 1-(a/30)
    else:
        a = 0

    #b is total % of seats of this type booked in this flight
    b = (supply_type-demand_type)/supply_type
    b = 1-b

    #c is total % of seats of other types booked in this flight
    if supply-supply_type >0: 
        c = ((supply-supply_type)-(demand-demand_type)/(supply-supply_type))
        c = 1-c
    else:
        c = b
    price = (0.3*(a)+0.4*(b)+0.3*(c))*(max_price-base_price)+base_price
    price = round(price, 2)
    response={'price':(price)}

    return JsonResponse(response, safe=False)

class MaximumSeatView(generics.ListCreateAPIView):
    #queryset = HotelRoom.objects.all()
    serializer_class = Flight_SeatsSerializer
    def get_queryset(self):
        source = self.request.GET.get("source",None)
        destination=self.request.GET.get("destination",None)
        seat_type= self.request.GET.get("type",None)
        seat_type=seat_type.split('|')
        return Flight_Seats.objects.filter(flight__source__name=source).filter(flight__destination__name=destination).filter(category__name__in=seat_type)
    def get(self, request, format=None):
        seat=self.get_queryset().order_by('-base_price').first()
        serializer = Flight_SeatsSerializer(seat)
        return Response(serializer.data)
class MinimumSeatView(generics.ListCreateAPIView):
    serializer_class = Flight_SeatsSerializer
    def get_queryset(self):
        source = self.request.GET.get("source",None)
        destination=self.request.GET.get("destination",None)
        seat_type= self.request.GET.get("type",None)
        seat_type=seat_type.split('|')
        return Flight_Seats.objects.filter(flight__source__name=source).filter(flight__destination__name=destination).filter(category__name__in=seat_type)
    def get(self, request, format=None):
        seat=self.get_queryset().order_by('-base_price').last()    
        serializer = Flight_SeatsSerializer(seat)
        return Response(serializer.data)

def bookings(request):
    date=request.GET.get("date",datetime.today().strftime('%Y-%m-%d'))
    user=request.user
    oper=Operator.objects.filter(user=user).values('hotel')
    hotelid=list(oper)[0]['hotel']

    q1=Q(from_date__lte=date)
    q2=Q(to_date__gte=date)

    supply=HotelRoom.objects.filter(hotel=hotelid)
    #supply=[i for i in supply]
    booked=RoomAvailability.objects.filter(room__in=supply).filter(q1 & q2).filter(status='bk')
    booked=booked.values('room__category__name','from_date','to_date','booked_by__first_name','price')
    supply=[i for i in supply.values('category__name','number_of_rooms')]
    print(supply,booked)

    response=[]
    x=0
    for i in supply:
        category=i['category__name']
        temp=booked.filter(room__category__name=category)
        tosend={}
        tosend['category']=category
        tosend['total']=i['number_of_rooms']
        tosend['booked']=[i for i in temp]
        response.append(tosend)

    return JsonResponse(response, safe=False)

	
class SeatType_ViewSet(viewsets.ModelViewSet):
    queryset = SeatType.objects.all()
    serializer_class = SeatTypeSerializer
	
class Flight_ViewSet(viewsets.ModelViewSet):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer
   
from api.serializers import NewFlightSerializer
from api.models import NewFlight, NewFlight_Seats

class NewFlight_ViewSet(viewsets.ModelViewSet):
    queryset = NewFlight.objects.all()
    serializer_class = NewFlightSerializer
	
def flight_register(request):
	flight_no = request.GET['flight_no']
	name = request.GET['name']
	email = request.GET['email']
	phno = request.GET['phno']
	day = request.GET['date']
	takeoff =request.GET['take']
	land = request.GET['land']
	src = request.GET['src']
	des=request.GET['des']
	img = request.GET['img']
	category = request.GET['category']
	tail_id = request.GET['tailId']
	next = request.GET['next']
	print(des)
	source = City.objects.get(name=src)
	print(source)
	destination = City.objects.get(name=des)
	tk = datetime.strptime(takeoff, '%H:%M:%S')
	landing = datetime.strptime(land, '%H:%M:%S')
	flight_no=int(flight_no)
	print(day)
	day= datetime.strptime(day,'%Y-%m-%d').date()
	
	flight = NewFlight(flightnumber=flight_no,airline_name=name,on_date=day,takeoff_time=tk,landing_time=landing,source=source,destination=destination,image_link=img,tail_id=tail_id,email=email,phone_number=phno)
	flight.save()
	
	cate = SeatType.objects.get(name=category)
	
	if(category == 'Economy'):
		
		seats1 = NewFlight_Seats(flight=flight,number_of_seats=request.GET['no_a'],category=cate,seat_position='a',base_price=request.GET['bprice_a'],max_price=request.GET['mprice_a'])							
		seats1.save()
		seats2 = NewFlight_Seats(flight=flight,number_of_seats=request.GET['no_m'],category=cate,seat_position='m',base_price=request.GET['bprice_m'],max_price=request.GET['mprice_m'])
		seats2.save()
		seats3 = NewFlight_Seats(flight=flight,number_of_seats=request.GET['no_w'],category=cate,seat_position='w',base_price=request.GET['bprice_w'],max_price=request.GET['mprice_w'])
		seats3.save()
	elif(category=='Business'):
		seats = NewFlight_Seats(flight=flight,number_of_seats=request.GET['no'],category=cate,seat_position='h',base_price=request.GET['bprice'],max_price=request.GET['mprice'])
		seats.save()
	else:
		seats = NewFlight_Seats(flight=flight,number_of_seats=request.GET['no'],category=cate,seat_position='p',base_price=request.GET['bprice'],max_price=request.GET['mprice'])
		seats.save()
	return redirect(next)
	
from api.models import Flight_Operator	
def flight_add_oper(request):
	id = request.GET['id'];
	flight1 = NewFlight.objects.filter(id=id).values('id','flightnumber','airline_name','takeoff_time','landing_time','source','destination','on_date','image_link','phone_number','tail_id','email')
	print (flight1[0])
	src =City.objects.get(id=flight1[0]['source'])
	des =City.objects.get(id=flight1[0]['destination'])
	name = str(flight1[0]['flightnumber'])+" "+str(flight1[0]['airline_name'])
	email = flight1[0]['email']
	flight = Flight(flightnumber=flight1[0]['flightnumber'],airline_name=flight1[0]['airline_name'],on_date=flight1[0]['on_date'],takeoff_time=flight1[0]['takeoff_time'],landing_time=flight1[0]['landing_time'],source=src,destination=des,image_link=flight1[0]['image_link'],tail_id=flight1[0]['tail_id'])
	flight.save()
	password = randomString()
	print(password)
	#delete from the registered table
	#hotel2 = Registered_Hotel.objects.filter(name=name).values('id')
	new_seats  = NewFlight_Seats.objects.filter(flight=flight1[0]['id']).values('number_of_seats','category','base_price','max_price','seat_position')
	for i in range(0,len(new_seats)):
		t = SeatType.objects.get(id=new_seats[i]['category'])
		seats = Flight_Seats(flight=flight,category = t,base_price = new_seats[i]['base_price'],max_price = new_seats[i]['max_price'],number_of_seats=new_seats[i]['number_of_seats'],seat_position=new_seats[i]['seat_position'])
		seats.save()
	user = User(username=flight1[0]['email'],password=password,email=flight1[0]['email'])
	user.set_password(user.password)
	user.save()
	role = "Flight Operator"
	profile = Flight_Operator(user=user,flight=flight,phone_number=flight1[0]['phone_number'],role=role)
	profile.save()
	flight2 = NewFlight.objects.get(id=id)
	flight2.delete()
	email_operator(name,email,password,"flight")
	return redirect('/customer/flight_verify/')
	 
	
from api.serializers import HotelOperator_Serializer, FlightOperator_Serializer
@method_decorator(csrf_exempt, name='dispatch')	
class HotelOperator_ViewSet(viewsets.ModelViewSet):
    #queryset = User.objects.all().order_by('-date_joined')
	serializer_class = HotelOperator_Serializer
	def perform_create(self, serializer):
		serializer.save(user=self.request.user)
	def get_queryset(self):
		user=self.request.user
		return Operator.objects.filter(user=user)
		
@method_decorator(csrf_exempt, name='dispatch')	
class FlightOperator_ViewSet(viewsets.ModelViewSet):
    #queryset = User.objects.all().order_by('-date_joined')
	serializer_class = FlightOperator_Serializer
	def perform_create(self, serializer):
		serializer.save(user=self.request.user)
	def get_queryset(self):
		user=self.request.user
		return Flight_Operator.objects.filter(user=user)
		
def hotelprofile_edit(request):
	email = request.GET["email"]
	phno = request.GET["phno"]
	
	u = User.objects.get(id=request.user.id)
	u.email=email
	u.save()
	pro = Operator.objects.get(user=request.user)
	pro.phone_number=phno
	pro.save()
	return redirect('/customer/profile')
	
def flightprofile_edit(request):
	email = request.GET["email"]
	phno = request.GET["phno"]
	
	u = User.objects.get(id=request.user.id)
	u.email=email
	u.save()
	pro = Flight_Operator.objects.get(user=request.user)
	pro.phone_number=phno
	pro.save()
	return redirect('/customer/profile')
