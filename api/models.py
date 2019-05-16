from django.db import models
import uuid
from django.contrib.auth.models import User
from django.core.validators import RegexValidator
import datetime
from django.urls import reverse 
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone

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
   
    city_name = models.ForeignKey(City, on_delete=models.CASCADE) 

    address = models.CharField(max_length=200)

    checkintime = models.TimeField()

    extratime = models.DurationField()

    image_link = models.CharField(max_length=500, default="")

    latitude = models.DecimalField(max_digits=14, decimal_places=10)

    longitude = models.DecimalField(max_digits=14, decimal_places=10)

    def __str__(self):
        return self.name
    
    def get_absolute_url(self):
        return reverse('hotel-detail', args=[str(self.id)])

class RoomType(models.Model):
    name = models.CharField(max_length=200, help_text='Enter type of room')
    def __str__(self):
        return self.name


class HotelRoom(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, help_text='Unique ID for this particular hotel')
    
    hotel = models.ForeignKey('Hotel', on_delete=models.CASCADE, null=True)

    capacity = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])

    description = models.TextField(max_length=1000, help_text='Enter description of the room.')

    category = models.ForeignKey('RoomType', on_delete=models.SET_NULL, null=True)

    base_price = models.DecimalField(max_digits=6, decimal_places=2, default=0)

    max_price = models.DecimalField(max_digits=6, decimal_places=2, default=0)

    number_of_rooms = models.IntegerField(default=1,validators=[MinValueValidator(1)])

    def __str__(self):
        return '%s,%s(%s)' % (self.category, self.number_of_rooms, self.hotel.name)

class RoomAvailability(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, help_text='Unique ID for this particular transaction')
    room = models.ForeignKey('HotelRoom', on_delete=models.CASCADE, null=True)
    from_date = models.DateField(default=datetime.date.today)
    to_date = models.DateField(default=datetime.date.today)
    booked_by = models.ForeignKey(User,null=False,on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    StatusTypes =(
        ('bk', 'Booked'),
        ('pr', 'Processing'),
        ('dd', 'Dead'),
    )

    status = models.CharField(max_length=2, choices=StatusTypes, help_text='Status')
    def __str__(self):
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
		
		
class Registered_Hotel(models.Model):
  id = models.UUIDField(primary_key=True, default=uuid.uuid4, help_text='Unique ID for this particular hotel')
  name = models.CharField(max_length=100)
  #country_name = models.ForeignKey(Country, on_delete=models.CASCADE)
  city_name = models.ForeignKey(City, on_delete=models.CASCADE)
  address = models.CharField(max_length=200)
  email = models.EmailField(max_length=70)
  phone_regex = RegexValidator(regex=r'^[0-9]{10}$', message="Phone number must be entered in the format: '999999999'. Up to 10 digits allowed.")
  phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=True)
  checkintime = models.TimeField()
  extratime = models.DurationField()
  #extra time is for the hotel to clean(used to calculate checkout time)
  image_link = models.CharField(max_length=500, default="")
  latitude = models.DecimalField(max_digits=14, decimal_places=10)
  longitude = models.DecimalField(max_digits=14, decimal_places=10)
  count = models.IntegerField(default=0)
  def __str__(self):
    """String for representing the Model object."""
    return self.name
  def get_absolute_url(self):
    """Returns the url to access a detail record for this hotel."""
    return reverse('hotel-detail', args=[str(self.id)])
		
class Operator(models.Model):
	user = models.OneToOneField(User,on_delete=models.CASCADE)
	hotel = models.OneToOneField(Hotel,on_delete=models.CASCADE)
	phone_regex = RegexValidator(regex=r'^[0-9]{10}$', message="Phone number must be entered in the format: '999999999'. Up to 10 digits allowed.")
	phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=True)
	role = models.CharField(max_length=10)
	def __str__(self):
		return self.user.username
		
class Registered_HotelPhotos(models.Model):

    hotel = models.ForeignKey('Registered_Hotel', on_delete=models.CASCADE, null=True)
    image_link = models.CharField(max_length=500, default="")

    def __str__(self):
        return self.hotel.name
		
class Registered_Rooms(models.Model):
	
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, help_text='Unique ID for this particular hotel')
   
    hotel = models.ForeignKey('Registered_Hotel', on_delete=models.CASCADE, null=True)

    capacity = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])

    description = models.TextField(max_length=1000, help_text='Enter description of the room.')

    category = models.ForeignKey('RoomType', on_delete=models.SET_NULL, null=True)#use when hotels can add new types of rooms

	
	#here
    base_price = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    max_price = models.DecimalField(max_digits=6, decimal_places=2, default=0)

    
    number_of_rooms = models.IntegerField(default=1,validators=[MinValueValidator(1)])

    def __str__(self):
        """String for representing the Model object."""
        return '%s,%s(%s)' % (self.category, self.number_of_rooms, self.hotel.name)

class SeatType(models.Model):
    name = models.CharField(max_length=200, help_text='Enter type of seats')
    def __str__(self):
        return self.name


class Flight(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, help_text='Unique ID for this particular flight')
    flightnumber = models.IntegerField(default=1)
    airline_name=models.CharField(max_length=100)
    takeoff_time=models.TimeField()
    landing_time=models.TimeField()
    source = models.ForeignKey('City', on_delete=models.CASCADE, related_name='source')
    destination = models.ForeignKey('City', on_delete=models.CASCADE, related_name='destination') 
    on_date=models.DateField(default=timezone.now)
    image_link = models.CharField(max_length=500, default="")
    tail_id = models.CharField(max_length=10)
    def __str__(self):
        return self.airline_name
    def get_absolute_url(self):
        return reverse('Flight-detail', args=[str(self.id)])

class Flight_Seats(models.Model):
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
    base_price = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    max_price = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    #price = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    def __str__(self):
        return '%s, %s'%(self.category, self.seat_position)

class Seat_Availability(models.Model):
    StatusTypes =(
        ('bk', 'Booked'),
        ('pr', 'Processing'),
        ('dd', 'Dead'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, help_text='Unique ID for this particular transaction')
    seat = models.ForeignKey('Flight_Seats', on_delete=models.CASCADE)
    status = models.CharField(max_length=2, choices=StatusTypes, help_text='Status')
    on_date=models.DateField(default=timezone.now)
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    booked_by = models.ForeignKey(User,null=False,on_delete=models.CASCADE)
    def __str__(self):
        return '%s,%s'%(self.status, self.seat.category)
		
class NewFlight(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, help_text='Unique ID for this particular flight')
    flightnumber = models.IntegerField(default=1)
    airline_name=models.CharField(max_length=100)
    takeoff_time=models.TimeField()
    landing_time=models.TimeField()
    source = models.ForeignKey('City', on_delete=models.CASCADE, related_name='newsource')
    destination = models.ForeignKey('City', on_delete=models.CASCADE, related_name='newdestination') 
    on_date=models.DateField(default=timezone.now)
    image_link = models.CharField(max_length=500, default="")
    tail_id = models.CharField(max_length=10)
    email = models.EmailField(max_length=70,default="")
    phone_regex = RegexValidator(regex=r'^[0-9]{10}$', message="Phone number must be entered in the format: '999999999'. Up to 10 digits allowed.")
    phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=True,default="")
    def __str__(self):
        """String for representing the Model object."""
        return self.airline_name
    def get_absolute_url(self):
        """Returns the url to access a detail record for this book."""
        return reverse('Flight-detail', args=[str(self.id)])

class NewFlight_Seats(models.Model):
    """Model representing a flight."""
    POSITION=(
        ('a', 'Aisle'),
        ('m', 'Middle'),
        ('w', 'Window'),
        ('h', 'Herringbone'),
        ('p', 'Private'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, help_text='Unique ID for this particular seat')
    flight = models.ForeignKey('NewFlight', on_delete=models.CASCADE)
    number_of_seats = models.IntegerField(default=1)
    category=models.ForeignKey('SeatType', on_delete=models.SET_NULL, null=True)
    seat_position=models.CharField( max_length=1, choices=POSITION, blank=False, default='m', help_text='position of seats')
    base_price = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    max_price = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    def __str__(self):
        return '%s, %s'%(self.category, self.seat_position)
		
class Flight_Operator(models.Model):
	user = models.OneToOneField(User,on_delete=models.CASCADE)
	flight = models.OneToOneField(Flight,on_delete=models.CASCADE)
	phone_regex = RegexValidator(regex=r'^[0-9]{10}$', message="Phone number must be entered in the format: '999999999'. Up to 10 digits allowed.")
	phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=True)
	role = models.CharField(max_length=10)
	def __str__(self):
		return self.user.username