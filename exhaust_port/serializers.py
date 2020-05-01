from rest_framework import serializers
from exhaust_port.models import XWing, DefenceTower, Coordinates
from django.contrib.auth.models import User


class CoordinatesSerializer(serializers.Serializer):
    x = serializers.IntegerField()
    y = serializers.IntegerField()
    z = serializers.IntegerField()


class XWingSerializer(serializers.ModelSerializer):
    coordinates = CoordinatesSerializer(Coordinates())

    class Meta:
        model = XWing
        fields = ['id', 'pilot', 'health', 'cost', 'name', 'coordinates']


class DefenceTowerSerializer(serializers.ModelSerializer):
    coordinates = CoordinatesSerializer(Coordinates())

    class Meta:
        model = DefenceTower
        fields = ['id', 'sector', 'health', 'cost', 'coordinates', 'target']


class PilotSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']
