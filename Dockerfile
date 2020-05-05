FROM python:3-slim
ENV PYTHONUNBUFFERED 1
RUN mkdir /app
WORKDIR /app

RUN apt-get update
RUN apt-get -y install nginx build-essential libpq-dev postgresql-client

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY death_star .
COPY exhaust_port .
COPY entrypoint.sh .
COPY manage.py .
COPY pytest.ini .
COPY static .

COPY nginx.conf /etc/nginx/sites-available/default

EXPOSE 80

ENTRYPOINT bash entrypoint.sh
