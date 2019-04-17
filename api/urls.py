
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
router.register(r'flights', views.FlightViewSet)
router.register(r'flight_seats', views.Flight_SeatsViewSet)
router.register(r'seattype', views.SeatTypeViewSet)
#router.register(r'roomavailability', views.RoomAvailabilityViewSet)
#router.register(r'roomavailabilitycreate', views.Availability)
#router.register(r'availabilitydetail',views.AvailabilityDetail)
#router.register(r'search', views.SearchSet)
#router.register(r'search1', views.SearchSet1)
# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    #    path(r'updateavalability/',views.UpdateAvailability.as_view())
    url(r'search', views.search, name="search"),
    url(r'sflights', views.sflights,name="searchflight"),
    url(r'check', views.check, name="check"),
    url(r'cflightstatus', views.cflightstatus, name="cflightstatus"),
    #url(r's_flight_seats_find', views.s_flight_seats_find, name="s_flight_seats_find"),
#    url(r'availabilitydetail', views.AvailabilityDetail.as_view(), name="AvailabilityDetail"),

    url(r'^roomavailability/$',views.RoomAvailabilityViewSet.as_view({'get': 'list', 'post': 'create'}),name='roomavailability-list',),
    url(r'^roomavailability/(?P<pk>[^/.]+)/$',views.RoomAvailabilityViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}),name='roomavailability-detail',),
    url(r'^maxroomprice/$', views.MaxHotelRoomView.as_view()),
    url(r'^minroomprice/$', views.MinHotelRoomView.as_view()),

    url(r'register',views.register,name="register"),
    url(r'^seat_availability/$',views.Seat_AvailabilityViewSet.as_view({'get': 'list', 'post': 'create'}),name='seat_availability-list',),
	url(r'^seat_availability/(?P<pk>[^/.]+)/$',views.Seat_AvailabilityViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}),name='seat_availability-detail',),


]