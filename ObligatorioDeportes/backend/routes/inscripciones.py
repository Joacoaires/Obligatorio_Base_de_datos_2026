from flask import Blueprint, request, jsonify
from database.connection import get_connection
from datetime import date

bp = Blueprint("inscripciones", __name__, url_prefix="/api/inscripciones")


@bp.get("/")
def listar():
    actividad_id  = request.args.get("actividad")
    estudiante_id = request.args.get("estudiante")

    conexion = get_connection()
    cursor = conexion.cursor(dictionary=True)

    if actividad_id is not None and estudiante_id is not None:
        cursor.execute("""
            SELECT i.*, CONCAT(e.nombre, ' ', e.apellido) AS estudiante, a.nombre AS actividad
            FROM inscripcion i
            JOIN estudiante e ON i.id_estudiante = e.id_estudiante
            JOIN actividad  a ON i.id_actividad  = a.id_actividad
            WHERE i.id_actividad = %s AND i.id_estudiante = %s
            ORDER BY i.fecha_inscripcion DESC
        """, (actividad_id, estudiante_id))

    elif actividad_id is not None:
        cursor.execute("""
            SELECT i.*, CONCAT(e.nombre, ' ', e.apellido) AS estudiante, a.nombre AS actividad
            FROM inscripcion i
            JOIN estudiante e ON i.id_estudiante = e.id_estudiante
            JOIN actividad  a ON i.id_actividad  = a.id_actividad
            WHERE i.id_actividad = %s
            ORDER BY i.fecha_inscripcion DESC
        """, (actividad_id,))

    elif estudiante_id is not None:
        cursor.execute("""
            SELECT i.*, CONCAT(e.nombre, ' ', e.apellido) AS estudiante, a.nombre AS actividad
            FROM inscripcion i
            JOIN estudiante e ON i.id_estudiante = e.id_estudiante
            JOIN actividad  a ON i.id_actividad  = a.id_actividad
            WHERE i.id_estudiante = %s
            ORDER BY i.fecha_inscripcion DESC
        """, (estudiante_id,))

    else:
        cursor.execute("""
            SELECT i.*, CONCAT(e.nombre, ' ', e.apellido) AS estudiante, a.nombre AS actividad
            FROM inscripcion i
            JOIN estudiante e ON i.id_estudiante = e.id_estudiante
            JOIN actividad  a ON i.id_actividad  = a.id_actividad
            ORDER BY i.fecha_inscripcion DESC
        """)

    inscripciones = cursor.fetchall()
    cursor.close()
    conexion.close()

    return jsonify(inscripciones)


@bp.post("/")
def inscribir():
    datos = request.get_json(force=True)
    id_estudiante = datos["id_estudiante"]
    id_actividad  = datos["id_actividad"]

    conexion = get_connection()
    cursor = conexion.cursor(dictionary=True)

    # Reglas 1 y 6: la actividad debe existir y estar ABIERTA
    cursor.execute("SELECT estado, cupo_maximo FROM actividad WHERE id_actividad = %s", (id_actividad,))
    actividad = cursor.fetchone()

    if actividad is None:
        cursor.close()
        conexion.close()
        return jsonify({"error": "Actividad no encontrada"}), 404

    if actividad["estado"] != "ABIERTA":
        cursor.close()
        conexion.close()
        return jsonify({"error": "La actividad no esta abierta"}), 409

    # Regla 4: no se permite doble inscripcion
    cursor.execute(
        "SELECT id_inscripcion FROM inscripcion WHERE id_estudiante = %s AND id_actividad = %s",
        (id_estudiante, id_actividad)
    )
    ya_inscripto = cursor.fetchone()

    if ya_inscripto is not None:
        cursor.close()
        conexion.close()
        return jsonify({"error": "El estudiante ya esta inscripto en esta actividad"}), 409

    # Reglas 2 y 3: verificar si hay cupo disponible
    cursor.execute(
        "SELECT COUNT(*) AS total FROM inscripcion WHERE id_actividad = %s AND estado = 'CONFIRMADA'",
        (id_actividad,)
    )
    fila = cursor.fetchone()
    cantidad_confirmados = fila["total"]

    if cantidad_confirmados < actividad["cupo_maximo"]:
        estado_inscripcion = "CONFIRMADA"
    else:
        estado_inscripcion = "LISTA_ESPERA"

    # Insertar la inscripcion
    fecha_hoy = date.today().isoformat()
    cursor = conexion.cursor()
    cursor.execute(
        "INSERT INTO inscripcion (id_estudiante, id_actividad, fecha_inscripcion, estado) VALUES (%s, %s, %s, %s)",
        (id_estudiante, id_actividad, fecha_hoy, estado_inscripcion)
    )
    conexion.commit()
    nuevo_id = cursor.lastrowid

    cursor.close()
    conexion.close()

    return jsonify({"id_inscripcion": nuevo_id, "estado": estado_inscripcion}), 201


@bp.delete("/<int:id>")
def cancelar(id):
    conexion = get_connection()
    cursor = conexion.cursor(dictionary=True)

    # Buscar la inscripcion antes de eliminar
    cursor.execute("SELECT * FROM inscripcion WHERE id_inscripcion = %s", (id,))
    inscripcion = cursor.fetchone()

    if inscripcion is None:
        cursor.close()
        conexion.close()
        return jsonify({"error": "Inscripcion no encontrada"}), 404

    # Eliminar la inscripcion
    cursor = conexion.cursor()
    cursor.execute("DELETE FROM inscripcion WHERE id_inscripcion = %s", (id,))
    conexion.commit()

    # Si era CONFIRMADA, promover al primero en LISTA_ESPERA
    if inscripcion["estado"] == "CONFIRMADA":
        cursor = conexion.cursor(dictionary=True)
        cursor.execute("""
            SELECT id_inscripcion FROM inscripcion
            WHERE id_actividad = %s AND estado = 'LISTA_ESPERA'
            ORDER BY fecha_inscripcion ASC
            LIMIT 1
        """, (inscripcion["id_actividad"],))
        siguiente = cursor.fetchone()

        if siguiente is not None:
            cursor = conexion.cursor()
            cursor.execute(
                "UPDATE inscripcion SET estado = 'CONFIRMADA' WHERE id_inscripcion = %s",
                (siguiente["id_inscripcion"],)
            )
            conexion.commit()

    cursor.close()
    conexion.close()

    return jsonify({"ok": True})