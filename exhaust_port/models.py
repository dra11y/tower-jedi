from django.contrib.auth.models import User
from django.db import models
from collections import namedtuple


def toInt(s):
    try:
        return int(s)
    except ValueError:
        return None


class Coordinates:
    x: int
    y: int
    z: int

    def __init__(self, x: int = None, y: int = None, z: int = None):
        self.x = x
        self.y = y
        self.z = z

    @classmethod
    def fromString(cls, coords):
        instance = cls()
        xyz = coords.split(",")
        if len(xyz) > 0:
            instance.x = toInt(xyz[0].strip())
        if len(xyz) > 1:
            instance.y = toInt(xyz[1].strip())
        if len(xyz) > 2:
            instance.z = toInt(xyz[2].strip())
        return instance

    def __str__(self):
        return f"[{self.x}, {self.y}, {self.z}]"


class XWing(models.Model):
    pilot = models.OneToOneField(User, on_delete=models.CASCADE)
    health = models.IntegerField(default=100, help_text="between 0 and 100")
    cost = models.FloatField(help_text="Cost in US $")
    name = models.CharField(max_length=12000)
    _coordinates = models.CharField(max_length=10000)

    def destroy(self):
        while self.health > 0:
            self.health -= 1
            self.save()

    def set_name(self, newName):
        self.name = newName

    def get_name(self):
        return self.name

    def is_destroyed(self, damage):
        return self.health - damage == 0

    @property
    def coordinates(self):
        return Coordinates.fromString(self._coordinates)

    @coordinates.setter
    def coordinates(self, value):
        # return Coordinates.fromString(value).__str__
        pass

    def __str__(self):
        return f"{self.name} piloted by {self.pilot} at [{self.coordinates}] health = {self.health}"


class DefenceTower(models.Model):
    sector = models.CharField(
        max_length=1000, choices=(("a1", 1), ("a2", 2), ("b1", 3), ("b2", 4))
    )
    health = models.IntegerField(default=100)
    cost = models.FloatField(help_text="Cost in US $")
    _coordinates = models.CharField(max_length=10000)
    target = models.ForeignKey(
        "exhaust_port.XWing", on_delete=models.SET_NULL, null=True
    )

    def is_destroyed(self, damage):
        return self.health - damage == 0

    def destroy(self):
        while self.health > 0:
            self.health -= 1
            self.save()

    def set_coordinates(self, x, y, z):
        coordinates = f"{x}0{y}0{z}"
        self._coordinates = coordinates

    def get_coordinates(self):
        x, y, z = self._coordinates.split("0")
        return int(x), int(y), int(z)

    @property
    def coordinates(self):
        return Coordinates.fromString(self._coordinates)

    def __str__(self):
        return f"Tower in sector {self.sector} at {self.coordinates} health = {self.health}"
