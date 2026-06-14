import os
import mysql.connector

def get_connection():
    conexion = mysql.connector.connect(
        host     = os.getenv("DB_HOST",     "localhost"),
        port     = int(os.getenv("DB_PORT", "3306")),
        user     = os.getenv("DB_USER",     "root"),
        password = os.getenv("DB_PASSWORD", "root"),
        database = os.getenv("DB_NAME",     "deportes_universitarios"),
        charset  = "utf8mb4"
    )
    return conexion
