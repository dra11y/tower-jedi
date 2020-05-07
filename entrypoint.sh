cd /app

. /etc/profile.d/pythonpath.sh

echo "ENVIRONMENT: ${ENVIRONMENT}"

echo "PYTHONPATH: ${PYTHONPATH}"

echo "===== ENV: ====="
env

service nginx start

python manage.py collectstatic --no-input

python manage.py migrate --no-input

echo "Creating superuser if needed..."
python manage.py createsuperuser --noinput

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
