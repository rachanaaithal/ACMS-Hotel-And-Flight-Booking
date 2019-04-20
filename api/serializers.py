from django.contrib.auth.models import User, Group
from rest_framework import serializers

from api.models import Country, City, Hotel, RoomType, HotelRoom, RoomAvailability, HotelPhotos
from api.models import Flight, Flight_Seats, Seat_Availability, SeatType


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')
'''
class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'password',
            'email',
        )
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)
        return super(UserSerializer, self).update(instance, validated_data)
'''
class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = '__all__'

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = '__all__'

class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = '__all__'

class RoomTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomType
        fields = '__all__'


class HotelRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = HotelRoom
        fields = '__all__'

class RoomAvailabilitySerializer(serializers.ModelSerializer):
#    booked_by = serializers.ReadOnlyField(default=serializers.CurrentUserDefault())
    booked_by = serializers.PrimaryKeyRelatedField(read_only=True,default=serializers.CurrentUserDefault())
#    booked_by = serializers.CreateOnlyDefault(serializers.CurrentUserDefault())

    hotel = serializers.ReadOnlyField(source="room.hotel.name")
    category = serializers.ReadOnlyField(source="room.category.name")
    address = serializers.ReadOnlyField(source="room.hotel.address")
    checkintime = serializers.ReadOnlyField(source="room.hotel.checkintime")
    extratime = serializers.ReadOnlyField(source="room.hotel.extratime")
    price = serializers.ReadOnlyField(source="room.price")
    status_name = serializers.SerializerMethodField()
    def get_status_name(self, obj):
        return obj.get_status_display()
    class Meta:
        model = RoomAvailability
        fields = '__all__'
        #depth = 2

class HotelPhotosSerializer(serializers.ModelSerializer):
    class Meta:
        model = HotelPhotos
        fields = '__all__'
		
from api.models import UserprofileInfo

class User1Serializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('id','username', 'email', 'first_name','last_name')
		
class UserProfileSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = UserprofileInfo
        fields = ('id','phone_number')

class SeatTypeSerializer(serializers.ModelSerializer):
    class Meta:
        fields='__all__'
        model=SeatType

class FlightSerializer(serializers.ModelSerializer):
    source = serializers.ReadOnlyField(source='source.name')
    destination=serializers.ReadOnlyField(source='destination.name')
    class Meta:
        fields = '__all__'
        model = Flight
        
class Flight_SeatsSerializer(serializers.ModelSerializer):
    class Meta:
        fields = '__all__'
        model = Flight_Seats

class Seat_AvailabilitySerializer(serializers.ModelSerializer):

    booked_by=serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())
    airline=serializers.ReadOnlyField(source="seat.flight.airline_name")
    flight_number=serializers.ReadOnlyField(source="seat.flight.flightnumber")
    category=serializers.ReadOnlyField(source="seat.category.name")
    source=serializers.ReadOnlyField(source="seat.flight.source.name")
    destination=serializers.ReadOnlyField(source="seat.flight.destination.name")
    date=serializers.ReadOnlyField(source="seat.flight.date")
    takeoff_time=serializers.ReadOnlyField(source="seat.flight.takeoff_time")
    landing_time=serializers.ReadOnlyField(source="seat.flight.landing_time")
    price=serializers.ReadOnlyField(source="seat.price")
    seat_id=serializers.ReadOnlyField(source="seat.id")
    def get_status_name(self, obj):
        return obj.get_status_display()
    class Meta:
        fields = '__all__'
        model=Seat_Availability    
