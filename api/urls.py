
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

router.register(r'operator',views.OperatorViewSet)

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
    url(r'check', views.check, name="check"),
#    url(r'availabilitydetail', views.AvailabilityDetail.as_view(), name="AvailabilityDetail"),

    url(r'^roomavailability/$',views.RoomAvailabilityViewSet.as_view({'get': 'list', 'post': 'create'}),name='roomavailability-list',),
    url(r'^roomavailability/(?P<pk>[^/.]+)/$',views.RoomAvailabilityViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}),name='roomavailability-detail',),
    url(r'^maxroomprice/$', views.MaxHotelRoomView.as_view()),
    url(r'^minroomprice/$', views.MinHotelRoomView.as_view()),
    url(r'^prices/$', views.prices, name="prices"),

    url(r'oper_register',views.oper_register,name="oper_register"),
    url(r'register',views.register,name="register"),

]



urlpatterns +=[url(r'edit',views.edit,name="edit"),]
urlpatterns +=[url(r'add_oper',views.add_oper,name="add_oper"),]