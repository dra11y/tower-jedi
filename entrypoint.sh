cd /app

echo "ENVIRONMENT: ${ENVIRONMENT}"

service nginx start

if [ "${ENVIRONMENT}" == "dev" ]; then
    echo "Waiting for Postgres ..."
    sleep 2
    until pg_isready -U ${POSTGRES_USER} -h ${POSTGRES_HOST}
    do
        sleep 1
    done
fi

python manage.py collectstatic --no-input

python manage.py migrate --no-input

echo "Creating superuser if needed..."
python manage.py createsuperuser --noinput

(cd client && yarn && yarn build --prod)

echo
echo
echo
if [ "${ENVIRONMENT}" == "dev" ]; then
    echo "Starting DEVELOPMENT server ..."
    python manage.py runserver 0.0.0.0:8000
else
    echo "Starting PRODUCTION server..."
    uvicorn --workers 2 death_star.asgi:application
fi
