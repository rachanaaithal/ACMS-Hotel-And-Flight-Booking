from django.contrib import admin

# Register your models here.
from api.models import Hotel, RoomType, HotelRoom, RoomAvailability, Country, City,UserprofileInfo, HotelPhotos
from api.models import SeatType, Flight, Flight_Seats, Seat_Availability

admin.site.register(Hotel)
admin.site.register(RoomType)
admin.site.register(HotelRoom)
admin.site.register(RoomAvailability)
admin.site.register(Country)
admin.site.register(City)
admin.site.register(UserprofileInfo)
admin.site.register(HotelPhotos)

admin.site.register(SeatType)
admin.site.register(Seat_Availability)
admin.site.register(Flight)
admin.site.register(Flight_Seats)
