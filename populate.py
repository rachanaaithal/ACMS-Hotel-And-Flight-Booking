import csv

project_home="/home/aithal/Documents/"

import sys,os
sys.path.append(project_home)
os.environ['DJANGO_SETTINGS_MODULE'] ='Project.settings'

from api.models import Country, City, Hotel, RoomType, HotelRoom, RoomAvailability, PricePerRoomType

with open("/home/aithal/Documents/Project/data/countries.csv",'r') as countrycsv:
    countryreader = csv.reader(countrycsv)
    next(countryreader)

    for row in countryreader:
        new= Country(name=row[0])
#        print(new.save())
        try:
            new.save()
        except:
            print("Problem with line:", row)

with open("/home/aithal/Documents/Project/data/cities.csv",'r') as citycsv:
    cityreader = csv.reader(citycsv)
    next(cityreader)

    for row in cityreader:
#        print(Country.objects.filter(name=row[0])[0])

        new= City(name=row[1], country=Country.objects.filter(name=row[0])[0])
#        print(new.save())
        try:
            new.save()
        except:
            print("Problem with line:", row)

import datetime
with open("/home/aithal/Documents/Project/data/hotel.csv",'r') as hotelcsv:
    hotelreader = csv.reader(hotelcsv)
    next(hotelreader)

    for row in hotelreader:
#        print(datetime.datetime.strptime(row[3],'%H:%M:%S').time(),datetime.timedelta(minutes=int(row[4])))

        new= Hotel(name=row[0], city_name=City.objects.filter(name=row[1])[0], address=row[2], checkintime=datetime.datetime.strptime(row[3],'%H:%M:%S').time(), extratime=datetime.timedelta(minutes=int(row[4])), image_link=row[5])
#        print(new.save())
        try:
            new.save()
        except:
            print("Problem with line:", row)

with open("/home/aithal/Documents/Project/data/roomtypes.csv",'r') as roomtypescsv:
    roomtypesreader = csv.reader(roomtypescsv)
    next(roomtypesreader)

    for row in roomtypesreader:
        new= RoomType(name=row[0])
#        print(new.save())
        try:
            new.save()
        except:
            print("Problem with line:", row)

with open("/home/aithal/Documents/Project/data/prices.csv",'r') as pricescsv:
    pricesreader = csv.reader(pricescsv)
    next(pricesreader)

    for row in pricesreader:
        new= PricePerRoomType(category=RoomType.objects.filter(name=row[1])[0], hotel=Hotel.objects.filter(name=row[0])[0], price=row[2])
#        print(new.save())
        try:
            new.save()
        except:
            print("Problem with line:", row)


with open("/home/aithal/Documents/Project/data/hotelroom.csv",'r') as hotelroomcsv:
    hotelroomreader = csv.reader(hotelroomcsv)
    next(hotelroomreader)
#    print(RoomType.objects.filter(name='AC')[0])

    for row in hotelroomreader:
#        print(Hotel.objects.filter(name=row[5])[0])
        new= HotelRoom(roomno=row[0], capacity=row[1] , description=row[2] , category=RoomType.objects.filter(name=row[3])[0], hotel=Hotel.objects.filter(name=row[4])[0])
#        print(new.save())
        try:
            new.save()
        except:
            print("Problem with line:", row)
