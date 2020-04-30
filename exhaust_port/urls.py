from django.urls import include, path
from rest_framework import routers
from exhaust_port import views


router = routers.DefaultRouter()
router.register(r'xwings', views.XWingViewSet)
# router.register(r'towers', views.GroupViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
