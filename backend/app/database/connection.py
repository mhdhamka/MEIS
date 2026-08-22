import mysql.connector

from app.config.settings import settings


def get_connection():

    return mysql.connector.connect(
        host=settings.database_host,
        port=settings.database_port,
        user=settings.database_user,
        password=settings.database_password,
        database=settings.database_name
    )