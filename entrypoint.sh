cd /app

# set PYTHONPATH to /usr/local... from Dockerfile
. /etc/profile.d/pythonpath.sh

# get AWS SECRETS variable injected into ECS task definition
# and split into environment variables:
for s in $(echo ${SECRETS} | jq -r "to_entries|map(\"\(.key)=\(.value|tostring)\")|.[]" ); do
    export $s
done

# Uncomment to debug environment:
# WARNING: secrets will be exposed in CloudWatch logs
# echo "===== ENVIRONMENT ======"
# env

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
