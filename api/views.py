from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from api.serializers import UserSerializer, GroupSerializer, HotelSerializer, CountrySerializer, CitySerializer, HotelRoomSerializer, RoomTypeSerializer, RoomAvailabilitySerializer
from api.models import Country, City, Hotel, RoomType, HotelRoom, RoomAvailability
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from django.http import JsonResponse
from django.db.models import Q
from django.core import serializers
import json
from rest_framework import generics


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

class Availability(generics.ListCreateAPIView):
    queryset = RoomAvailability.objects.all()
    serializer_class = RoomAvailabilitySerializer


class AvailabilityDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = RoomAvailability.objects.all()
    serializer_class = RoomAvailabilitySerializer



class RoomAvailabilityViewSet(viewsets.ModelViewSet):
    queryset = RoomAvailability.objects.all()
    serializer_class = RoomAvailabilitySerializer
    filter_fields = {
        'room': ['exact']
    }
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



from rest_framework import generics
class SearchSet(viewsets.ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    filter_fields = {
        'name': ['exact']
    }

def search(request):
    name=request.GET["name"]
    st=request.GET["start"]
    ed=request.GET["end"]
    st=st.strip()
    ed=ed.strip()

    print(name,st,ed)
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
    supply = HotelRoom.objects.filter(hotel__city_name__name=name).values('hotel__name', 'category__name', 'hotel__image_link', 'hotel__id','number_of_rooms')
    
#Get Demand from room availability table
    demand = RoomAvailability.objects.filter((q1 & q2) | (q3 & q4) | (q5 & q6)| (q7 & q8)).filter(room__hotel__city_name__name=name)
    # print('demand:',list(demand.values('room__hotel__name','room__category__name')) )
    demand = [x['room__hotel__name']+':'+x['room__category__name'] for x in list(demand.values('room__hotel__name','room__category__name'))]
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
            response[result['hotel__name']] = {}
            response[result['hotel__name']]['image_link']=result['hotel__image_link']
            response[result['hotel__name']]['room_types']={}
            response[result['hotel__name']]['hotel_id']=result['hotel__id'] 
        response[result['hotel__name']]['room_types'][result['category__name']] = rooms_actually_available

    print('\n\nresponse',response)
    
    #making into json
    response = [{'hotel':key, 'room_types':response[key]['room_types'], 'image_link':response[key]['image_link'], 'hotel_id':response[key]['hotel_id']} for key in response]

    return JsonResponse(response, safe=False)

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
    supply = HotelRoom.objects.filter(hotel__id=name).filter(category__id=category).values('hotel__name', 'category__id', 'hotel__image_link', 'hotel__id','number_of_rooms')
    
#Get Demand from room availability table
    demand = RoomAvailability.objects.filter((q1 & q2) | (q3 & q4) | (q5 & q6)| (q7 & q8)).filter(room__hotel__id=name).filter(room__category__id=category)

#    print('checking',list(supply)[0]['number_of_rooms'],len(list(demand)))
    if((list(supply)[0]['number_of_rooms']-len(list(demand)))>0):
        response=True
    else:
        response=False

    return JsonResponse(response, safe=False)