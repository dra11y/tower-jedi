from rest_framework import viewsets
from exhaust_port.models import XWing, DefenceTower
from exhaust_port.serializers import *
from django.contrib.auth.models import User
import math
import json
from rest_framework.response import Response


class XWingViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows XWings to be viewed or edited.
    """
    queryset = XWing.objects.all()
    serializer_class = XWingSerializer
    # permission_classes = [permissions.IsAuthenticated]


class DefenceTowerViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Defence Towers to be viewed or edited.
    """
    queryset = DefenceTower.objects.all()
    serializer_class = DefenceTowerSerializer
    # permission_classes = [permissions.IsAuthenticated]


class PilotViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Pilots (Users) to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = PilotSerializer
    # permission_classes = [permissions.IsAuthenticated]


# class xwinglist(APIView):
#     # Does something to get xwings
#     def get(self, request, **kwargs):
#         x = XWing.objects.all()
#         data = []
#         for z in x:
#             data.append(z.id)
#         return Response(json.dumps(data))

#     def post(self, request, **kwargs):
#         id = request.data.get("id")
#         if not isinstance(id, int):
#             return Response("Bad request")
#         XWing.objects.create(**request.data)
#         return Response("ok")


# class DefenceTowerView(APIView):
#     # TODO: I want to be able to get all towers targeting given xwing
#     # TODO: As a pilot of XWing I want to be able to destroy the tower if it's targeting me
#     pass
