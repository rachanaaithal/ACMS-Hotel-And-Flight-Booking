from django.contrib import admin

# Register your models here.
from api.models import Hotel, RoomType, HotelRoom, RoomAvailability, Country, City,UserprofileInfo, HotelPhotos

admin.site.register(Hotel)
admin.site.register(RoomType)
admin.site.register(HotelRoom)
admin.site.register(RoomAvailability)
admin.site.register(Country)
admin.site.register(City)
admin.site.register(UserprofileInfo)
admin.site.register(HotelPhotos)

from api.models import Registered_Hotel,Operator
admin.site.register(Registered_Hotel)
admin.site.register(Operator)

from api.models import Registered_HotelPhotos
admin.site.register(Registered_HotelPhotos)

from api.models import Registered_Rooms
admin.site.register(Registered_Rooms)

from api.models import NewFlight_Seats,NewFlight
admin.site.register(NewFlight)
admin.site.register(NewFlight_Seats)

from api.models import Flight_Operator
admin.site.register(Flight_Operator)
