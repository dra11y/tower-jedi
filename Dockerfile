FROM python:3-slim
ENV PYTHONUNBUFFERED 1
RUN mkdir /app
WORKDIR /app

# Ensure latest security updates are applied
RUN apt-get update && apt-get upgrade

RUN apt-get -y install \
    nginx build-essential libpq-dev postgresql-client \
    curl iputils-ping

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY client client
COPY death_star death_star
COPY exhaust_port exhaust_port
COPY entrypoint.sh .
COPY manage.py .
COPY pytest.ini .

COPY nginx.conf /etc/nginx/sites-available/default

COPY build build

EXPOSE 80

ENTRYPOINT bash entrypoint.sh
