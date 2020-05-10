import json
import math
import random
import time

from django.contrib.auth.models import User
from django.http import HttpResponse
from faker import Faker
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView

from exhaust_port.models import DefenceTower, XWing
from exhaust_port.serializers import (CoordinatesSerializer,
                                      DefenceTowerSerializer, PilotSerializer,
                                      XWingSerializer)

import requests


class CurrentUserView(APIView):
    def get(self, request):
        serializer = PilotSerializer(request.user)
        return Response(serializer.data)


class SeederView(APIView):
    def post(self, request):
        json_data = json.loads(request.body)
        seed_count = 3

        try:
            seed_count = int(json_data["count"])
        except ValueError:
            pass # take the default

        def rand_coord(faker):
            return faker.random_int(min=-100, max=100)

        def rand_coords(faker):
            return f"{rand_coord(faker)}, {rand_coord(faker)}, {rand_coord(faker)}"

        faker = Faker()

        people = None
        try:
            people = requests.get("https://swapi.dev/api/people/").json()["results"]
            print("USING STAR WARS API FOR PILOT NAMES!")
            if seed_count > len(people):
                seed_count = len(people)
        except requests.exceptions.RequestException:
            print("USING FAKER FOR PILOT NAMES!")
            pass

        DefenceTower.objects.all().delete()
        print("Deleted all DefenceTowers!")

        XWing.objects.all().delete()
        print("Deleted all XWings!")

        User.objects.exclude(username="admin").all().delete()
        print("Deleted all Pilots!")

        for _ in range(seed_count):
            if people is None:
                pilot = {
                    "first_name": faker.first_name(),
                    "last_name": faker.last_name()
                }
            else:
                i = random.randint(0, len(people) - 1)
                person = people[i]
                del people[i]
                split_name = person["name"].split(" ")
                if len(split_name) < 2:
                    split_name.append("")
                pilot = {
                    "first_name": split_name[0],
                    "last_name": split_name[1]
                }

            u = User(
                username=pilot["first_name"].lower() + pilot["last_name"].lower(),
                first_name=pilot["first_name"],
                last_name=pilot["last_name"],
                email=f"{pilot['first_name']}.{pilot['last_name']}@deathstar.starwars.example",
                is_staff=False,
                is_active=True
            )
            u.save()

            xw = XWing(
                pilot=u,
                health=faker.random_int(min=25, max=100),
                cost=faker.random_int(min=100_000_000, max=2_000_000_000),
                name=faker.domain_word(),
                _coordinates=rand_coords(faker)
            )
            xw.save()

            t = DefenceTower(
                target=xw,
                sector=random.choice(['a1', 'a2', 'b1', 'b2']),
                health=faker.random_int(min=25, max=100),
                cost=faker.random_int(min=100_000_000, max=2_000_000_000),
                _coordinates=rand_coords(faker)
            )
            t.save()

        return Response({"status": "OK"})


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

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.destroy()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


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
