. .env

echo "ENVIRONMENT: ${ENVIRONMENT}"

if [ "${ENVIRONMENT}" == "dev" ]; then
    echo 'Waiting for Postgres ...'
    sleep 2
    until pg_isready -U ${POSTGRES_USER} -h ${POSTGRES_HOST}
    do
        sleep 1
    done
fi

# python manage.py collectstatic --no-input

# Should probably vet migrate in deploy process with DevOps confirmation
# in production, but should be OK during development:
python manage.py migrate --no-input

echo "Creating superuser if needed..."
python manage.py createsuperuser --noinput

python manage.py runserver 0.0.0.0:8000
