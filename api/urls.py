
from django.urls import include, path
from rest_framework import routers
from api import views
from django.conf.urls import url,include

router = routers.SimpleRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)

router.register(r'country', views.CountryViewSet)
router.register(r'city', views.CityViewSet)
router.register(r'hotels', views.HotelViewSet)
router.register(r'roomtype', views.RoomTypeViewSet)
router.register(r'hotelroom', views.HotelRoomViewSet)
router.register(r'hotelphotos', views.HotelPhotosViewSet)


router.register(r'profile1', views.User1ViewSet,base_name='profile1')
router.register(r'profile2', views.UserProfileViewSet,base_name='profile2')



router.register(r'citylist',views.CityListViewSet,base_name='citylist')
router.register(r'newhotels',views.NewHotelViewSet,base_name='new_hotels')
router.register(r'hotels12', views.Hotels_ViewSet)

router.register(r'flights', views.FlightViewSet)
router.register(r'flight_seats', views.Flight_SeatsViewSet)
router.register(r'seattype', views.SeatTypeViewSet)
router.register(r'operator',views.OperatorViewSet)


router.register(r'seattype1',views.SeatType_ViewSet)
router.register(r'flights1',views.Flight_ViewSet)
router.register(r'newflights',views.NewFlight_ViewSet)

router.register(r'hotelprofile',views.HotelOperator_ViewSet,base_name='hotelprofile')
router.register(r'flightprofile',views.FlightOperator_ViewSet,base_name='flightprofile')


urlpatterns = [
    path('', include(router.urls)),
    url(r'search', views.search, name="search"),
    url(r'check', views.check, name="check"),
    url(r'sflights', views.sflights,name="searchflight"),
    url(r'cflightstatus', views.cflightstatus, name="cflightstatus"),
    url(r'^flightcharges/$', views.flightcharges, name="flightcharges"),
#    url(r'availabilitydetail', views.AvailabilityDetail.as_view(), name="AvailabilityDetail"),
    url(r'^roomavailability/$',views.RoomAvailabilityViewSet.as_view({'get': 'list', 'post': 'create'}),name='roomavailability-list',),
    url(r'^roomavailability/(?P<pk>[^/.]+)/$',views.RoomAvailabilityViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}),name='roomavailability-detail',),
    url(r'^maxroomprice/$', views.MaxHotelRoomView.as_view()),
    url(r'^minroomprice/$', views.MinHotelRoomView.as_view()),
    url(r'^maximumseatcharge/$', views.MaximumSeatView.as_view()),
    url(r'^minimumseatcharge/$', views.MinimumSeatView.as_view()),
    url(r'^prices/$', views.prices, name="prices"),

    url(r'flightregister',views.flight_register,name='flightregister'),
	
	
    url(r'oper_register',views.oper_register,name="oper_register"),
    url(r'register',views.register,name="register"),
    url(r'^seat_availability/$',views.Seat_AvailabilityViewSet.as_view({'get': 'list', 'post': 'create'}),name='seat_availability-list',),
    url(r'^seat_availability/(?P<pk>[^/.]+)/$',views.Seat_AvailabilityViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}),name='seat_availability-detail',),

    url(r'bookings', views.bookings, name="bookings"),
    url(r'mail_confirmation',views.booking_mail, name="mail_confirmation"),
    url(r'flightmail_confirmations',views.flights_mails,name="flightmail_confirmations"),
    
]


urlpatterns +=[url(r'flight_add_oper',views.flight_add_oper,name="flight_add_oper"),]

urlpatterns +=[url(r'hoteledit',views.hotelprofile_edit,name="hoteledit"),]
urlpatterns +=[url(r'flightedit',views.flightprofile_edit,name="flightedit"),]




urlpatterns +=[url(r'edit',views.edit,name="edit"),]
urlpatterns +=[url(r'add_oper',views.add_oper,name="add_oper"),]