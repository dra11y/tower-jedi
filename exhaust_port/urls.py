from django.urls import path
from exhaust_port.views import xwinglist

urlpatterns = [
    path("xwings/", xwinglist.as_view()),
]
