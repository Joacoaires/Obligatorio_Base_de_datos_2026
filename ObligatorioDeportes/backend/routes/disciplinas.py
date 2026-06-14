from flask import Blueprint, request, jsonify
from database.connection import get_connection

bp = Blueprint("disciplinas", __name__, url_prefix="/api/disciplinas")


@bp.get("/")
def listar():
    conexion = get_connection()
    cursor = conexion.cursor(dictionary=True)

    cursor.execute("SELECT * FROM disciplina ORDER BY nombre")
    disciplinas = cursor.fetchall()

    cursor.close()
    conexion.close()

    return jsonify(disciplinas)


@bp.get("/<int:id>")
def obtener(id):
    conexion = get_connection()
    cursor = conexion.cursor(dictionary=True)

    cursor.execute("SELECT * FROM disciplina WHERE id_disciplina = %s", (id,))
    disciplina = cursor.fetchone()

    cursor.close()
    conexion.close()

    if disciplina is None:
        return jsonify({"error": "Disciplina no encontrada"}), 404

    return jsonify(disciplina)


@bp.post("/")
def crear():
    datos = request.get_json(force=True)
    nombre = datos["nombre"]

    conexion = get_connection()
    cursor = conexion.cursor()

    try:
        cursor.execute("INSERT INTO disciplina (nombre) VALUES (%s)", (nombre,))
        conexion.commit()
        nuevo_id = cursor.lastrowid
        cursor.close()
        conexion.close()
        return jsonify({"id_disciplina": nuevo_id}), 201

    except Exception as error:
        cursor.close()
        conexion.close()
        return jsonify({"error": str(error)}), 500


@bp.put("/<int:id>")
def actualizar(id):
    datos = request.get_json(force=True)
    nombre = datos["nombre"]

    conexion = get_connection()
    cursor = conexion.cursor()

    cursor.execute("UPDATE disciplina SET nombre = %s WHERE id_disciplina = %s", (nombre, id))
    conexion.commit()

    cursor.close()
    conexion.close()

    return jsonify({"ok": True})


@bp.delete("/<int:id>")
def eliminar(id):
    conexion = get_connection()
    cursor = conexion.cursor()

    try:
        cursor.execute("DELETE FROM disciplina WHERE id_disciplina = %s", (id,))
        conexion.commit()
        cursor.close()
        conexion.close()
        return jsonify({"ok": True})

    except Exception:
        cursor.close()
        conexion.close()
        return jsonify({"error": "No se puede eliminar, tiene actividades asociadas"}), 409
