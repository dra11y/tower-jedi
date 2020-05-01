from django.urls import include, path
from rest_framework.routers import DefaultRouter
from exhaust_port import views


class OptionalSlashRouter(DefaultRouter):
    def __init__(self, *args, **kwargs):
        super(OptionalSlashRouter, self).__init__(*args, **kwargs)
        self.trailing_slash = "/?"


router = OptionalSlashRouter()
router.register(r'xwings', views.XWingViewSet)
router.register(r'towers', views.DefenceTowerViewSet)
router.register(r'pilots', views.PilotViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
