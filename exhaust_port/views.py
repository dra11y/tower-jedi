import json
import math
import random
import time

from django.contrib.auth.models import User
from django.http import HttpResponse
from rest_framework import viewsets

from exhaust_port.models import DefenceTower, XWing
from exhaust_port.serializers import (CoordinatesSerializer,
                                      DefenceTowerSerializer, PilotSerializer,
                                      XWingSerializer)

# def seed(request):
#     def rand_coord(seeder):
#         return seeder.faker.random_int(min=-100, max=100)

#     DefenceTower.objects.all().delete()
#     print("Deleted all DefenceTowers!")

#     XWing.objects.all().delete()
#     print("Deleted all XWings!")

#     User.objects.exclude(username="admin").all().delete()
#     print("Deleted all Pilots!")

#     seeder = Seed.seeder()

#     ADD_COUNT = 10

#     seeder.add_entity(User, ADD_COUNT)

#     inserted_ids = seeder.execute()
#     user_ids = list(inserted_ids.values())[0]
#     users = list(User.objects.filter(id__in=user_ids).order_by("?"))

#     print(f"Added {ADD_COUNT} Pilots!")

#     clear(seeder)

#     seeder.add_entity(XWing, ADD_COUNT, {
#         'pilot': lambda x, users=users: users.pop(),
#         'health': lambda x: seeder.faker.random_int(min=1, max=100),
#         'cost': lambda x: seeder.faker.random_int(min=100_000_000, max=2_000_000_000),
#         'name': lambda x: seeder.faker.domain_word(),
#         '_coordinates': lambda x: f"{rand_coord(seeder)}, {rand_coord(seeder)}, {rand_coord(seeder)}"
#     })

#     inserted_ids = seeder.execute()
#     xwing_ids = list(inserted_ids.values())[0]
#     xwings = list(XWing.objects.filter(id__in=xwing_ids).order_by("?"))

#     print(f"Added {ADD_COUNT} XWings!")

#     clear(seeder)

#     seeder.add_entity(DefenceTower, ADD_COUNT, {
#         'target': lambda x, xwings=xwings: random.choice(xwings),
#         'sector': lambda x: random.choice(['a1', 'a2', 'b1', 'b2']),
#         'health': lambda x: seeder.faker.random_int(min=1, max=100),
#         'cost': lambda x: seeder.faker.random_int(min=100_000_000, max=2_000_000_000),
#         '_coordinates': lambda x: f"{rand_coord(seeder)}, {rand_coord(seeder)}, {rand_coord(seeder)}"
#     })

#     inserted_ids = seeder.execute()
#     print(f"Added {ADD_COUNT} DefenceTowers!")

#     return HttpResponse("<h1>Database Reset!</h1>")


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
