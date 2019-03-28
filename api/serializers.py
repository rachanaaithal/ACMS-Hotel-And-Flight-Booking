from django.contrib.auth.models import User, Group
from rest_framework import serializers
from api.models import Country, City, Hotel, RoomType, HotelRoom, RoomAvailability


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