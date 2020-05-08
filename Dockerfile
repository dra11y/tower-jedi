FROM python:3.7-slim-buster AS stage0
ENV PYTHONUNBUFFERED 1
RUN mkdir /app
WORKDIR /app

RUN apt-get update && apt-get upgrade

RUN apt-get -y install build-essential libpq-dev

COPY requirements.txt .
RUN pip install --user --no-cache-dir --no-warn-script-location -r requirements.txt

FROM python:3.7-slim-buster AS stage1
ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get upgrade
RUN apt-get -y install nginx jq

COPY --from=stage0 /root/.local /usr/local/

RUN echo 'export PYTHONPATH="/usr/local/lib/python3.8/site-packages"' > /etc/profile.d/pythonpath.sh

RUN mkdir /app
WORKDIR /app

COPY death_star death_star
COPY exhaust_port exhaust_port
COPY build build
COPY entrypoint.sh .
COPY manage.py .
COPY pytest.ini .

COPY nginx.conf /etc/nginx/sites-available/default

COPY build build

EXPOSE 80

ENTRYPOINT bash entrypoint.sh
