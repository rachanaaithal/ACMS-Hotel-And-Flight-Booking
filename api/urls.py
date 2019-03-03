from django.urls import include, path
from rest_framework import routers
from api import views
from django.conf.urls import url,include

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)

router.register(r'country', views.CountryViewSet)
router.register(r'city', views.CityViewSet)
router.register(r'hotel', views.HotelViewSet)
router.register(r'roomtype', views.RoomTypeViewSet)
router.register(r'hotelroom', views.HotelRoomViewSet)
router.register(r'roomavailability', views.RoomAvailabilityViewSet)
#router.register(r'search', views.SearchSet)
#router.register(r'search1', views.SearchSet1)
# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    url(r'search', views.search, name="search")
]