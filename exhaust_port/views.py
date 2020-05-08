import json
import math
import random
import time

from django.contrib.auth.models import User
from django.http import HttpResponse
from faker import Faker
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from exhaust_port.models import DefenceTower, XWing
from exhaust_port.serializers import (CoordinatesSerializer,
                                      DefenceTowerSerializer, PilotSerializer,
                                      XWingSerializer)


class CurrentUserView(APIView):
    def get(self, request):
        serializer = PilotSerializer(request.user)
        return Response(serializer.data)


class SeederView(APIView):
    def post(self, request):
        def rand_coord(faker):
            return faker.random_int(min=-100, max=100)

        def rand_coords(faker):
            return f"{rand_coord(faker)}, {rand_coord(faker)}, {rand_coord(faker)}"

        faker = Faker()

        DefenceTower.objects.all().delete()
        print("Deleted all DefenceTowers!")

        XWing.objects.all().delete()
        print("Deleted all XWings!")

        User.objects.exclude(username="admin").all().delete()
        print("Deleted all Pilots!")

        for _ in range(10):
            u = User(
                username=faker.user_name(),
                first_name=faker.first_name(),
                last_name=faker.last_name(),
                email=faker.email(),
                is_staff=False,
                is_active=True
            )
            u.save()

            xw = XWing(
                pilot=u,
                health=faker.random_int(min=1, max=100),
                cost=faker.random_int(min=100_000_000, max=2_000_000_000),
                name=faker.domain_word(),
                _coordinates=rand_coords(faker)
            )
            xw.save()

            t = DefenceTower(
                target=xw,
                sector=random.choice(['a1', 'a2', 'b1', 'b2']),
                health=faker.random_int(min=1, max=100),
                cost=faker.random_int(min=100_000_000, max=2_000_000_000),
                _coordinates=rand_coords(faker)
            )
            t.save()

        return HttpResponse("<h1>Database Reset!</h1>")


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
