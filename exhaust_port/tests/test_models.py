import pytest

from exhaust_port.models import XWing


@pytest.fixture
def x_wing(admin_user):
    return XWing(
        pilot=admin_user, cost=13331.33, name="random_name", _coordinates="20305"
    )


@pytest.mark.django_db
class TestXwing:
    def test_is_destroyed(self, x_wing):
        assert x_wing.is_destroyed(100)
        assert not x_wing.is_destroyed(99)
