from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from api.serializers import UserSerializer, GroupSerializer, HotelSerializer, CountrySerializer, CitySerializer, HotelRoomSerializer, RoomTypeSerializer, RoomAvailabilitySerializer, PricePerRoomTypeSerializer
from api.models import Country, City, Hotel, RoomType, HotelRoom, RoomAvailability, PricePerRoomType 
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from django.http import JsonResponse
from django.db.models import Q
from django.core import serializers
import json

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
        'id': ['exact']
    }

class RoomAvailabilityViewSet(viewsets.ModelViewSet):
    queryset = RoomAvailability.objects.all()
    serializer_class = RoomAvailabilitySerializer

class RoomTypeViewSet(viewsets.ModelViewSet):
    queryset = RoomType.objects.all()
    serializer_class = RoomTypeSerializer

class PricePerRoomTypeViewSet(viewsets.ModelViewSet):
    queryset = PricePerRoomType.objects.all()
    serializer_class = PricePerRoomTypeSerializer
    filter_fields={
        'hotel':['exact']
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

    city_results = Hotel.objects.filter(city_name__name=name)

    q1=Q(from_date__gte=st)
    q2=Q(from_date__lte=ed) 
    q3=Q(to_date__gte=st)
    q4=Q(to_date__lte=ed)
    q5=Q(from_date__lte=st)
    q6=Q(to_date__gte=ed)
#print([(i.room.hotel.name, i.from_date) for i in RoomAvailability.objects.filter(Q(room__hotel__in=[i.id for i in city_results])).filter((q1 & q2) | (q3 & q4) | (q5 & q6))])
#print([(i.room.id) for i in RoomAvailability.objects.filter(Q(room__hotel__in=[i.id for i in city_results])).filter((q1 & q2) | (q3 & q4) | (q5 & q6))])

#to get all availabe rooms           
    room_results = HotelRoom.objects.filter(hotel__in=[i.id for i in city_results]).exclude(id__in = [i.room.id for i in RoomAvailability.objects.filter(Q(room__hotel__in=[i.id for i in city_results])).filter((q1 & q2) | (q3 & q4) | (q5 & q6))]).values('hotel__name', 'roomno', 'category__name', 'hotel__image_link', 'hotel__id')
#    print([(i,i.hotel) for i in room_results])
#    print(room_results)

#To make the query set into a dictionary
    response = {}
    for result in list(room_results):
        #if new hotel name
        if result['hotel__name'] not in response:
            response[result['hotel__name']] = {}
            response[result['hotel__name']]['image_link']=result['hotel__image_link']
            response[result['hotel__name']]['room_types']={}
            response[result['hotel__name']]['hotel_id']=result['hotel__id']
        #if new room type 
        if result['category__name'] not in response[result['hotel__name']]['room_types']: 
            response[result['hotel__name']]['room_types'][result['category__name']] = 1
        #if room type already encountered
        else: 
            response[result['hotel__name']]['room_types'][result['category__name']] += 1
    print(response)
    
    #making into json
    response = [{'hotel':key, 'room_types':response[key]['room_types'], 'image_link':response[key]['image_link'], 'hotel_id':response[key]['hotel_id']} for key in response]
    # for ele  in room_results:
    #     print(ele.hotel.get_absolute_url())

#to get avalaboe hotel names
#    hotel_results = Hotel.objects.filter(id__in=[room.hotel.id for room in room_results])
#    print([(i,i.id) for i in hotel_results])

    # return JsonResponse({'hotel':hotel_results})
    return JsonResponse(response, safe=False)