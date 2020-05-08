from rest_framework import serializers
from exhaust_port.models import XWing, DefenceTower, Coordinates
from django.contrib.auth.models import User


class CoordinatesSerializer(serializers.Serializer):
    x = serializers.IntegerField()
    y = serializers.IntegerField()
    z = serializers.IntegerField()


class PilotSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']


class XWingSerializer(serializers.ModelSerializer):
    coordinates = CoordinatesSerializer(Coordinates())
    pilot = PilotSerializer(read_only=True)

    class Meta:
        model = XWing
        fields = ['id', 'pilot', 'health', 'cost', 'name', 'coordinates']


class DefenceTowerSerializer(serializers.ModelSerializer):
    coordinates = CoordinatesSerializer(Coordinates())
    target = XWingSerializer(read_only=True)

    class Meta:
        model = DefenceTower
        fields = ['id', 'is_destroyed', 'sector', 'health', 'cost', 'coordinates', 'target']
