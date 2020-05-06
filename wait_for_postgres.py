import logging
import os
import sys
from time import sleep, time

import psycopg2

check_timeout = os.getenv("POSTGRES_CHECK_TIMEOUT", 30)
check_interval = os.getenv("POSTGRES_CHECK_INTERVAL", 1)
interval_unit = "second" if check_interval == 1 else "seconds"
config = {
    "host": sys.argv[1],
    "dbname": sys.argv[2],
    "user": sys.argv[3],
    "password": sys.argv[4]
}


start_time = time()
logger = logging.getLogger()
logger.setLevel(logging.INFO)
logger.addHandler(logging.StreamHandler())
assert check_timeout > 0
assert check_interval < check_timeout


def pg_is_ready(host, user, password, dbname):
    while time() - start_time < check_timeout:
        try:
            conn = psycopg2.connect(**vars())
            logger.info("Postgres is ready! ✨ 💅")
            conn.close()
            return True
        except psycopg2.OperationalError:
            logger.info(
                f"Postgres isn't ready. Waiting for {check_interval} {interval_unit}...")
            sleep(check_interval)

    logger.error(
        f"We could not connect to Postgres within {check_timeout} seconds.")
    return False


pg_is_ready(**config)
