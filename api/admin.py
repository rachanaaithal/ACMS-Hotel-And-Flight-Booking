from django.contrib import admin

# Register your models here.
from api.models import Hotel, RoomType, HotelRoom, RoomAvailability, Country, City

admin.site.register(Hotel)
admin.site.register(RoomType)
admin.site.register(HotelRoom)
admin.site.register(RoomAvailability)
admin.site.register(Country)
admin.site.register(City)
