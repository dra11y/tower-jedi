import pytest


@pytest.mark.django_db
class TestGetXWings:
    def test_get(self, client):
        print("qwefqweqfwe xwing...")
        response = client.get("/exhaust_port/xwings/")
        assert response.status_code == 200
