import psycopg2
from app.config.settings import settings


def get_connection():
    return psycopg2.connect(
        host=settings.database_host,
        port=settings.database_port,
        user=settings.database_user,
        password=settings.database_password,
        database=settings.database_name
    )