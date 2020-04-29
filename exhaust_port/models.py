from django.contrib.auth.models import User
from django.db import models

# Create your models here.


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

    def set_coordinates(self, x, y, z):
        coordinates = f"{x}0{y}0{z}"
        self._coordinates = coordinates

    def get_coordinates(self):
        x, y, z = self._coordinates.split("0")
        return int(x), int(y), int(z)


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
