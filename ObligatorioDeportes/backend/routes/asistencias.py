from flask import Blueprint, request, jsonify
from database.connection import get_connection
from datetime import date

bp = Blueprint("asistencias", __name__, url_prefix="/api/asistencias")


@bp.get("/")
def listar():
    actividad_id = request.args.get("actividad")
    fecha        = request.args.get("fecha")

    conexion = get_connection()
    cursor = conexion.cursor(dictionary=True)

    if actividad_id is not None and fecha is not None:
        cursor.execute("""
            SELECT ast.*, CONCAT(e.nombre, ' ', e.apellido) AS estudiante, a.nombre AS actividad
            FROM asistencia ast
            JOIN estudiante e ON ast.id_estudiante = e.id_estudiante
            JOIN actividad  a ON ast.id_actividad  = a.id_actividad
            WHERE ast.id_actividad = %s AND ast.fecha = %s
            ORDER BY ast.fecha DESC, e.apellido
        """, (actividad_id, fecha))

    elif actividad_id is not None:
        cursor.execute("""
            SELECT ast.*, CONCAT(e.nombre, ' ', e.apellido) AS estudiante, a.nombre AS actividad
            FROM asistencia ast
            JOIN estudiante e ON ast.id_estudiante = e.id_estudiante
            JOIN actividad  a ON ast.id_actividad  = a.id_actividad
            WHERE ast.id_actividad = %s
            ORDER BY ast.fecha DESC, e.apellido
        """, (actividad_id,))

    elif fecha is not None:
        cursor.execute("""
            SELECT ast.*, CONCAT(e.nombre, ' ', e.apellido) AS estudiante, a.nombre AS actividad
            FROM asistencia ast
            JOIN estudiante e ON ast.id_estudiante = e.id_estudiante
            JOIN actividad  a ON ast.id_actividad  = a.id_actividad
            WHERE ast.fecha = %s
            ORDER BY ast.fecha DESC, e.apellido
        """, (fecha,))

    else:
        cursor.execute("""
            SELECT ast.*, CONCAT(e.nombre, ' ', e.apellido) AS estudiante, a.nombre AS actividad
            FROM asistencia ast
            JOIN estudiante e ON ast.id_estudiante = e.id_estudiante
            JOIN actividad  a ON ast.id_actividad  = a.id_actividad
            ORDER BY ast.fecha DESC, e.apellido
        """)

    asistencias = cursor.fetchall()
    cursor.close()
    conexion.close()

    return jsonify(asistencias)


@bp.post("/")
def registrar():
    datos = request.get_json(force=True)
    id_estudiante = datos["id_estudiante"]
    id_actividad  = datos["id_actividad"]
    fecha         = datos.get("fecha", date.today().isoformat())
    asistio       = datos.get("asistio", True)

    conexion = get_connection()
    cursor = conexion.cursor(dictionary=True)

    # Regla 5: solo inscripciones CONFIRMADAS pueden registrar asistencia
    cursor.execute(
        "SELECT estado FROM inscripcion WHERE id_estudiante = %s AND id_actividad = %s",
        (id_estudiante, id_actividad)
    )
    inscripcion = cursor.fetchone()

    if inscripcion is None:
        cursor.close()
        conexion.close()
        return jsonify({"error": "El estudiante no esta inscripto en la actividad"}), 409

    if inscripcion["estado"] != "CONFIRMADA":
        cursor.close()
        conexion.close()
        return jsonify({"error": "Solo se registra asistencia de inscripciones confirmadas"}), 409

    # Insertar asistencia (si ya existe para esa fecha, actualiza)
    cursor = conexion.cursor()
    cursor.execute(
        "INSERT INTO asistencia (id_estudiante, id_actividad, fecha, asistio) VALUES (%s, %s, %s, %s) ON DUPLICATE KEY UPDATE asistio = %s",
        (id_estudiante, id_actividad, fecha, asistio, asistio)
    )
    conexion.commit()
    nuevo_id = cursor.lastrowid

    cursor.close()
    conexion.close()

    return jsonify({"id_asistencia": nuevo_id}), 201


@bp.delete("/<int:id>")
def eliminar(id):
    conexion = get_connection()
    cursor = conexion.cursor()

    cursor.execute("DELETE FROM asistencia WHERE id_asistencia = %s", (id,))
    conexion.commit()

    cursor.close()
    conexion.close()

    return jsonify({"ok": True})
