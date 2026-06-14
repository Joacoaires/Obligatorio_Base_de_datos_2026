from flask import Blueprint, request, jsonify
from database.connection import get_connection

bp = Blueprint("actividades", __name__, url_prefix="/api/actividades")


@bp.get("/")
def listar():
    conexion = get_connection()
    cursor = conexion.cursor(dictionary=True)

    cursor.execute("""
        SELECT a.*, d.nombre AS disciplina, e.nombre AS espacio
        FROM actividad a
        JOIN disciplina d ON a.id_disciplina = d.id_disciplina
        JOIN espacio e    ON a.id_espacio    = e.id_espacio
        ORDER BY a.nombre
    """)
    actividades = cursor.fetchall()

    cursor.close()
    conexion.close()

    return jsonify(actividades)


@bp.get("/<int:id>")
def obtener(id):
    conexion = get_connection()
    cursor = conexion.cursor(dictionary=True)

    cursor.execute("""
        SELECT a.*, d.nombre AS disciplina, e.nombre AS espacio
        FROM actividad a
        JOIN disciplina d ON a.id_disciplina = d.id_disciplina
        JOIN espacio e    ON a.id_espacio    = e.id_espacio
        WHERE a.id_actividad = %s
    """, (id,))
    actividad = cursor.fetchone()

    cursor.close()
    conexion.close()

    if actividad is None:
        return jsonify({"error": "Actividad no encontrada"}), 404

    return jsonify(actividad)


@bp.post("/")
def crear():
    datos = request.get_json(force=True)

    nombre        = datos["nombre"]
    id_disciplina = datos["id_disciplina"]
    id_espacio    = datos["id_espacio"]
    cupo_maximo   = datos["cupo_maximo"]
    dia           = datos["dia"]
    hora          = datos["hora"]
    estado        = datos.get("estado", "ABIERTA")

    conexion = get_connection()
    cursor = conexion.cursor()

    cursor.execute(
        "INSERT INTO actividad (nombre, id_disciplina, id_espacio, cupo_maximo, dia, hora, estado) VALUES (%s, %s, %s, %s, %s, %s, %s)",
        (nombre, id_disciplina, id_espacio, cupo_maximo, dia, hora, estado)
    )
    conexion.commit()
    nuevo_id = cursor.lastrowid

    cursor.close()
    conexion.close()

    return jsonify({"id_actividad": nuevo_id}), 201


@bp.put("/<int:id>")
def actualizar(id):
    datos = request.get_json(force=True)

    nombre        = datos["nombre"]
    id_disciplina = datos["id_disciplina"]
    id_espacio    = datos["id_espacio"]
    cupo_maximo   = datos["cupo_maximo"]
    dia           = datos["dia"]
    hora          = datos["hora"]
    estado        = datos["estado"]

    conexion = get_connection()
    cursor = conexion.cursor()

    cursor.execute(
        "UPDATE actividad SET nombre = %s, id_disciplina = %s, id_espacio = %s, cupo_maximo = %s, dia = %s, hora = %s, estado = %s WHERE id_actividad = %s",
        (nombre, id_disciplina, id_espacio, cupo_maximo, dia, hora, estado, id)
    )
    conexion.commit()

    cursor.close()
    conexion.close()

    return jsonify({"ok": True})


@bp.delete("/<int:id>")
def eliminar(id):
    conexion = get_connection()
    cursor = conexion.cursor()

    try:
        cursor.execute("DELETE FROM actividad WHERE id_actividad = %s", (id,))
        conexion.commit()
        cursor.close()
        conexion.close()
        return jsonify({"ok": True})

    except Exception:
        cursor.close()
        conexion.close()
        return jsonify({"error": "No se puede eliminar, tiene inscripciones o asistencias asociadas"}), 409
