import os
import datetime
import decimal
import mysql.connector

DB_CONFIG = {
    "host":     os.getenv("DB_HOST",     "localhost"),
    "port":     int(os.getenv("DB_PORT", "3306")),
    "user":     os.getenv("DB_USER",     "root"),
    "password": os.getenv("DB_PASSWORD", "root"),
    "database": os.getenv("DB_NAME",     "deportes_universitarios"),
    "charset":  "utf8mb4",
}

def get_connection():
    return mysql.connector.connect(**DB_CONFIG)

def convertir_valor(value):
    if isinstance(value, datetime.timedelta):
        return str(value)

    if isinstance(value, datetime.date):
        return value.isoformat()

    if isinstance(value, decimal.Decimal):
        return float(value)

    return value

def convertir_fila(row):
    if row is None:
        return None

    return {
        key: convertir_valor(value)
        for key, value in row.items()
    }

def query(sql, params=(), fetchone=False):
    conn = get_connection()
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute(sql, params)

        if fetchone:
            return convertir_fila(cur.fetchone())

        return [convertir_fila(row) for row in cur.fetchall()]
    finally:
        conn.close()

def execute(sql, params=()):
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(sql, params)
        conn.commit()
        return cur.lastrowid
    finally:
        conn.close()