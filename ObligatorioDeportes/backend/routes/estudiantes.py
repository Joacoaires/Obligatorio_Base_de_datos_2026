from flask import Blueprint, request, jsonify
from database.connection import get_connection

bp = Blueprint("estudiantes", __name__, url_prefix="/api/estudiantes")


@bp.get("/")
def listar():
    conexion = get_connection()
    cursor = conexion.cursor(dictionary=True)

    cursor.execute("SELECT * FROM estudiante ORDER BY apellido, nombre")
    estudiantes = cursor.fetchall()

    cursor.close()
    conexion.close()

    return jsonify(estudiantes)


@bp.get("/<int:id>")
def obtener(id):
    conexion = get_connection()
    cursor = conexion.cursor(dictionary=True)

    cursor.execute("SELECT * FROM estudiante WHERE id_estudiante = %s", (id,))
    estudiante = cursor.fetchone()

    cursor.close()
    conexion.close()

    if estudiante is None:
        return jsonify({"error": "Estudiante no encontrado"}), 404

    return jsonify(estudiante)


@bp.post("/")
def crear():
    datos = request.get_json(force=True)

    documento = datos["documento"]
    nombre    = datos["nombre"]
    apellido  = datos["apellido"]
    correo    = datos["correo"]
    carrera   = datos["carrera"]
    facultad  = datos["facultad"]

    conexion = get_connection()
    cursor = conexion.cursor()

    try:
        cursor.execute(
            "INSERT INTO estudiante (documento, nombre, apellido, correo, carrera, facultad) VALUES (%s, %s, %s, %s, %s, %s)",
            (documento, nombre, apellido, correo, carrera, facultad)
        )
        conexion.commit()
        nuevo_id = cursor.lastrowid
        cursor.close()
        conexion.close()
        return jsonify({"id_estudiante": nuevo_id}), 201

    except Exception as error:
        cursor.close()
        conexion.close()
        if "Duplicate" in str(error):
            return jsonify({"error": "Documento o correo ya registrado"}), 409
        return jsonify({"error": str(error)}), 500


@bp.put("/<int:id>")
def actualizar(id):
    datos = request.get_json(force=True)

    documento = datos["documento"]
    nombre    = datos["nombre"]
    apellido  = datos["apellido"]
    correo    = datos["correo"]
    carrera   = datos["carrera"]
    facultad  = datos["facultad"]

    conexion = get_connection()
    cursor = conexion.cursor()

    cursor.execute(
        "UPDATE estudiante SET documento = %s, nombre = %s, apellido = %s, correo = %s, carrera = %s, facultad = %s WHERE id_estudiante = %s",
        (documento, nombre, apellido, correo, carrera, facultad, id)
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
        cursor.execute("DELETE FROM estudiante WHERE id_estudiante = %s", (id,))
        conexion.commit()
        cursor.close()
        conexion.close()
        return jsonify({"ok": True})

    except Exception:
        cursor.close()
        conexion.close()
        return jsonify({"error": "No se puede eliminar, tiene inscripciones asociadas"}), 409

