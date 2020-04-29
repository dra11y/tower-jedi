from rest_framework.views import *
from exhaust_port.models import XWing, DefenceTower
import math
import json
from rest_framework.response import Response


class xwinglist(APIView):
    # Does something to get xwings
    def get(self, request, **kwargs):
        x = XWing.objects.all()
        data = []
        for z in x:
            data.append(z.id)
        return Response(json.dumps(data))

    def post(self, request, **kwargs):
        id = request.data.get("id")
        if not isinstance(id, int):
            return Response("Bad request")
        XWing.objects.create(**request.data)
        return Response("ok")


class DefenceTowerView(APIView):
    # TODO: I want to be able to get all towers targeting given xwing
    # TODO: As a pilot of XWing I want to be able to destroy the tower if it's targeting me
    pass
