from django.db import models
import uuid
from django.contrib.auth.models import User
from django.core.validators import RegexValidator
import datetime
from django.utils import timezone

# Create your models here.

class Country(models.Model):
    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name

class City(models.Model):
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name

class Hotel(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, help_text='Unique ID for this particular hotel')
    
    name = models.CharField(max_length=100)

#    country_name = models.ForeignKey(Country, on_delete=models.CASCADE)
   
    city_name = models.ForeignKey(City, on_delete=models.CASCADE) 

    address = models.CharField(max_length=200)

    checkintime = models.TimeField()

    extratime = models.DurationField()
    #extra time is for the hotel to clean(used to calculate checkout time)

    image_link = models.CharField(max_length=500, default="")

    latitude = models.DecimalField(max_digits=14, decimal_places=10)

    longitude = models.DecimalField(max_digits=14, decimal_places=10)

    def __str__(self):
        """String for representing the Model object."""
        return self.name
    
    def get_absolute_url(self):
        """Returns the url to access a detail record for this hotel."""
        return reverse('hotel-detail', args=[str(self.id)])

class RoomType(models.Model):
    #use this to allow the hotels to add new types of rooms
    name = models.CharField(max_length=200, help_text='Enter type of room')
    def __str__(self):
        """String for representing the Model object."""
        return self.name
'''
class PricePerRoomType(models.Model):
    
    hotel = models.ForeignKey('Hotel', on_delete=models.CASCADE, null=True)

    category = models.ForeignKey('RoomType', on_delete=models.SET_NULL, null=True)#use when hotels can add new types of rooms

    price = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return f'{self.price}-{self.category}({self.hotel.name})'
'''
from django.urls import reverse # Used to generate URLs by reversing the URL patterns
from django.core.validators import MinValueValidator, MaxValueValidator

class HotelRoom(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, help_text='Unique ID for this particular hotel')
    
#    roomno = models.CharField(max_length=6, default='A000')
    
    hotel = models.ForeignKey('Hotel', on_delete=models.CASCADE, null=True)

    capacity = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])

    description = models.TextField(max_length=1000, help_text='Enter description of the room.')

    category = models.ForeignKey('RoomType', on_delete=models.SET_NULL, null=True)#use when hotels can add new types of rooms

    price = models.DecimalField(max_digits=6, decimal_places=2, default=0)

    number_of_rooms = models.IntegerField(default=1,validators=[MinValueValidator(1)])

    """
    #use when hotels can't add new types of room
    RoomType = (
        ('nor', 'Normal(Non-AC)'),
        ('ac', 'AC'),
        ('del', 'Delux'),
    )

    category = models.CharField(
        max_length=3,
        choices=RoomType,
        default='nor',
        help_text='Room Type',
    )
    """

#    class Meta:
#        ordering = ['price']

    def __str__(self):
        """String for representing the Model object."""
        return '%s,%s(%s)' % (self.category, self.number_of_rooms, self.hotel.name)

#from django.utils import timezone #with timezone.now
import datetime

class RoomAvailability(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, help_text='Unique ID for this particular transaction')
    room = models.ForeignKey('HotelRoom', on_delete=models.CASCADE, null=True)
    from_date = models.DateField(default=datetime.date.today)
    to_date = models.DateField(default=datetime.date.today)
    booked_by = models.ForeignKey(User,null=False,on_delete=models.CASCADE)

    StatusTypes =(
        ('bk', 'Booked'),
        ('pr', 'Processing'),
        ('dd', 'Dead'),
    )

    status = models.CharField(max_length=2, choices=StatusTypes, help_text='Status')


#    class Meta:
#        odering = ['date']

    def __str__(self):
        """String for representing the Model object."""
        return '%s(%s)' % (self.room.category, self.room.hotel.name)
		

        
class UserprofileInfo(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    phone_regex = RegexValidator(regex=r'^[0-9]{10}$', message="Phone number must be entered in the format: '999999999'. Up to 10 digits allowed.")
    phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=True)
    role = models.CharField(max_length=10)
    def __str__(self):
        return self.user.username

class HotelPhotos(models.Model):

    hotel = models.ForeignKey('Hotel', on_delete=models.CASCADE, null=True)
    image_link = models.CharField(max_length=500, default="")

    def __str__(self):
        return self.hotel.name




class SeatType(models.Model):
    name = models.CharField(max_length=200, help_text='Enter type of seats')
    def __str__(self):
        return self.name


class Flight(models.Model):
    """Model representing a flight.
    DAYS=(
        ('sun', 'Sunday'),
        ('mon', 'Monday'),
        ('tue', 'Tuesday'),
        ('wed', 'Wednesday'),
        ('thur', 'Thursday'),
        ('fri', 'Friday'),
        ('sat', 'Saturday'),
    )"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, help_text='Unique ID for this particular flight')
    flightnumber = models.IntegerField(default=1)
    airline_name=models.CharField(max_length=100)
    takeoff_time=models.TimeField()
    landing_time=models.TimeField()
    source = models.ForeignKey('City', on_delete=models.CASCADE, related_name='source')
    destination = models.ForeignKey('City', on_delete=models.CASCADE, related_name='destination') 
    on_date=models.DateField(default=timezone.now)
    #day=models.CharField( max_length=4, choices=DAYS, blank=True, default='sun', help_text='day of departure')
    #number_of_seats = models.IntegerField(default=1)
    image_link = models.CharField(max_length=500, default="")
    tail_id = models.CharField(max_length=10)
    '''class Meta:
        unique_together = (('flight_id', 'airline_id'),)'''
    def __str__(self):
        """String for representing the Model object."""
        return self.airline_name
    def get_absolute_url(self):
        """Returns the url to access a detail record for this book."""
        return reverse('Flight-detail', args=[str(self.id)])

class Flight_Seats(models.Model):
    """Model representing a flight."""
    POSITION=(
        ('a', 'Aisle'),
        ('m', 'Middle'),
        ('w', 'Window'),
        ('h', 'Herringbone'),
        ('p', 'Private'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, help_text='Unique ID for this particular seat')
    #change it to AutoField
    #seat_number=models.IntegerField(default=1)
    flight = models.ForeignKey('Flight', on_delete=models.CASCADE)
    number_of_seats = models.IntegerField(default=1)
    category=models.ForeignKey('SeatType', on_delete=models.SET_NULL, null=True)
    seat_position=models.CharField( max_length=1, choices=POSITION, blank=False, default='m', help_text='position of seats')
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    def __str__(self):
        '''if self.seat_position==None:
            return "ERROR-CUSTOMER NAME IS NULL"
        elif self.seat_position=='':
            return ""'''
        return '%s, %s'%(self.category, self.seat_position)
    #return 'hi'

class Seat_Availability(models.Model):
    """Model representing a flight."""
    StatusTypes =(
        ('bk', 'Booked'),
        ('pr', 'Processing'),
        ('dd', 'Dead'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, help_text='Unique ID for this particular transaction')
    seat = models.ForeignKey('Flight_Seats', on_delete=models.CASCADE)
    status = models.CharField(max_length=2, choices=StatusTypes, help_text='Status')
    on_date=models.DateField(default=timezone.now)
    booked_by = models.ForeignKey(User,null=False,on_delete=models.CASCADE)
    '''class Meta:
        unique_together = (('flight_id', 'seat_id'),)'''
    def __str__(self):
        return '%s,%s'%(self.status, self.seat.category)


#uncomment the number of seats variable to have number of seats in a flight
#comment out the number of seats from flight_seats and just update the model for nuber of seats in the flight model
