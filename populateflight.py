import csv
import sys,os
import datetime

#project_home="/home/mukesh/flight"
#sys.path.append(project_home)
os.environ['DJANGO_SETTINGS_MODULE'] ='Project.settings'
#export DJANGO_SETTINGS_MODULE = project.settings
from django.core.wsgi import get_wsgi_application
import datetime
from decimal import Decimal
application = get_wsgi_application()
from api.models import Flight, Flight_Seats, City, Seat_Availability, SeatType, Country

p=SeatType(name="Economy")
try:
	p.save()
except Exception as e:
	print(e)
p=SeatType(name="Business")
try:
	p.save()
except Exception as e:
	print(e)
p=SeatType(name="First Class")
try:
	p.save()
except Exception as e:
	print(e)

country={}
cities={}
airlines=[]
with open('/home/mukesh/ACMS-Hotel-And-Flight-Booking/data/country.csv') as csvfile:
	reader=csv.DictReader(csvfile)
	for row in reader:
		if row['Code'] not in country:
			country[row['Code']]=row['Name']
			p=Country(name=country[row['Code']])
			try:
				p.save()
			except Exception as e:
				print(e)

with open('/home/mukesh/ACMS-Hotel-And-Flight-Booking/data/airports.csv') as csvfile:
	reader=csv.DictReader(csvfile)
	for row in reader:
		if row['iata_code'] not in cities:
			cities[row['iata_code']]=row['municipality']
			p=City(country=Country.objects.filter(name=country[row['iso_country']])[0],name=cities[row['iata_code']])
			try:
				p.save()
			except Exception as e:
				print(e)
with open('/home/mukesh/ACMS-Hotel-And-Flight-Booking/data/airline.csv') as csvfile:
	reader=csv.DictReader(csvfile)
	for row in reader:
		if row['airline_name'] not in airlines:
			m={}
			m[row['airline_name']]=row['image_link']
			airlines.append(m)

'''with open('/home/mukesh/ACMS-Hotel-And-Flight-Booking/data/flight.csv') as csvfile:
	reader=csv.DictReader(csvfile)
	for row in reader:
		deptime=row['DepTime']
		if(deptime=='NA'):
			continue
		if(deptime[0:2]=="24"):
			deptime="00"+deptime[2:]
		if(len(deptime)==1):
			deptime="0"+deptime+":00:00"
		elif(len(deptime)==2):
			deptime="00:"+deptime+":00"
		elif(len(deptime)==3):
			deptime="0"+deptime[0]+":"+deptime[1:]+":00"
		else:
			deptime=deptime[0:2]+":"+deptime[2:]+":00"
		if len(row['Month'])==1:
			month='0'+row['Month']
		if len(row['DayofMonth'])==1:
			date='0'+row['DayofMonth']
		dep=row['Year']+"-"+month+"-"+date
		arrtime=row['ArrTime']
		if(arrtime=='NA'):
			continue
		if(arrtime[0:2]=="24"):
			arrtime="00"+arrtime[2:]
		if(len(arrtime)==1):
			arrtime="0"+arrtime+":00:00"
		elif(len(arrtime)==2):
			arrtime="00:"+arrtime+":00"
		elif(len(arrtime)==3):
			arrtime="0"+arrtime[0]+":"+arrtime[1:]+":00"
		else:
			arrtime=arrtime[0:2]+":"+arrtime[2:]+":00"
		arr=row['Year']+"-"+month+"-"+date
		p=Flight(flightnumber=int(row['FlightNum']), airline_name=airlines[i][0],takeoff_time=datetime.datetime.strptime(deptime,'%H:%M:%S').time(), landing_time=datetime.datetime.strptime(arrtime,'%H:%M:%S').time(), source=City.objects.filter(name=cities[row['Origin']])[0], destination=City.objects.filter(name=cities[row['Dest']])[0], date=datetime.strptime(dep, "%Y-%m-%d").date(), image_link=airline[i][airline_name], tail_id=row['TailNum'])
		try:
			p.save()
		except Exception as e:
			print(e)
		i=1
		while i<=120:
			p=Flight_Seats(flight_id=Flight.objects.filter(flight_id=row['FlightNum'])[0],seat_id=i, category='e', seat_position='a', price=5550.50)
			try:
				p.save()
			except Exception as e:
				print(e)
			p=Flight_Seats(flight_id=Flight.objects.filter(flight_id=row['FlightNum'])[0], seat_id=i+1, category='e', seat_position='m', price=5000.00)
			try:
				p.save()
			except Exception as e: 
				print(e)
			p=Flight_Seats(flight_id=Flight.objects.filter(flight_id=row['FlightNum'])[0], seat_id=i+2, category='e', seat_position='w', price=5750.50)
			try:
				p.save()
			except Exception as e:
				print(e)
			i=i+3
		p=Flight_Seats(flight=Flight.objects.filter(flightnumber=int(row['FlightNum'])), number_of_seats=80, category=SeatType.objects.filter(name='Economy'), )
'''
with open('/home/mukesh/ACMS-Hotel-And-Flight-Booking/data/flight.csv') as csvfile:
	reader=csv.DictReader(csvfile)
	for row in reader:
		#print(cities[row['source']])
		#print(City.objects.filter(name=cities[row['source']])[0])
		#print(City.objects.filter(name=cities[row['destination']])[0])
		p=Flight(flightnumber=int(row['flightnumber']), airline_name=row['airlinename'], takeoff_time=datetime.datetime.strptime(row['takeofftime'], '%H:%M:%S').time(), landing_time=datetime.datetime.strptime(row['landingtime'],'%H:%M:%S').time(), source=City.objects.filter(name=cities[row['source']])[0], destination=City.objects.filter(name=cities[row['destination']])[0], on_date=datetime.datetime.strptime(row['date'],"%Y-%m-%d").date(), image_link=row['image_link'], tail_id=row['tailid'])
		try:
			p.save()
		except Exception as e:
			print(e)

with open('/home/mukesh/ACMS-Hotel-And-Flight-Booking/data/flightseats.csv') as csvfile:
	reader=csv.DictReader(csvfile)
	for row in reader:
		if(row['category']=='Business'):
			p=Flight_Seats(flight=Flight.objects.filter(flightnumber=row['flight'])[0], number_of_seats=int(row['numberofseats']), category=SeatType.objects.filter(name=row['category'])[0], seat_position=row['seatposition'], price=Decimal(row['price']))
			try:
				p.save()
			except Exception as e:
				print("Exception in business: ", e)
		elif (row['category']=='First Class'):
			p=Flight_Seats(flight=Flight.objects.filter(flightnumber=row['flight'])[0], number_of_seats=int(row['numberofseats']), category=SeatType.objects.filter(name=row['category'])[0], seat_position=row['seatposition'], price=Decimal(row['price']))
			print(row['category'])
			try:
				p.save()
			except Exception as e:
				print("Exception in first class: ", e)
		else:
			print(row['category'])
			p=Flight_Seats(flight=Flight.objects.filter(flightnumber=row['flight'])[0], number_of_seats=int(int(row['numberofseats'])/3),category=SeatType.objects.filter(name=row['category'])[0], seat_position='a', price=Decimal(row['price'])+700)
			try:
				p.save()
			except Exception as e:
				print(e)
			p=Flight_Seats(flight=Flight.objects.filter(flightnumber=row['flight'])[0], number_of_seats=int(int(row['numberofseats'])/3),category=SeatType.objects.filter(name=row['category'])[0], seat_position='w', price=Decimal(row['price'])+1000)
			try:
				p.save()
			except Exception as e:
				print(e)
			p=Flight_Seats(flight=Flight.objects.filter(flightnumber=row['flight'])[0], number_of_seats=int(int(row['numberofseats'])/3),category=SeatType.objects.filter(name=row['category'])[0], seat_position='m', price=Decimal(row['price']))
			try:
				p.save()
			except Exception as e:
				print(e)