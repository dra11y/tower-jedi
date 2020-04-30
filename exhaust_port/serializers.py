from rest_framework import serializers
from exhaust_port.models import XWing, DefenceTower, Coordinates


class CoordinatesSerializer(serializers.Serializer):
    x = serializers.IntegerField()
    y = serializers.IntegerField()
    z = serializers.IntegerField()


class XWingSerializer(serializers.ModelSerializer):
    coordinates = CoordinatesSerializer(Coordinates())

    class Meta:
        model = XWing
        fields = ['pilot', 'health', 'cost', 'name', 'coordinates']
