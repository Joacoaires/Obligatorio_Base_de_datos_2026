from flask import Blueprint, request, jsonify
from database.connection import get_connection

bp = Blueprint("espacios", __name__, url_prefix="/api/espacios")


@bp.get("/")
def listar():
    conexion = get_connection()
    cursor = conexion.cursor(dictionary=True)

    cursor.execute("SELECT * FROM espacio ORDER BY nombre")
    espacios = cursor.fetchall()

    cursor.close()
    conexion.close()

    return jsonify(espacios)


@bp.get("/<int:id>")
def obtener(id):
    conexion = get_connection()
    cursor = conexion.cursor(dictionary=True)

    cursor.execute("SELECT * FROM espacio WHERE id_espacio = %s", (id,))
    espacio = cursor.fetchone()

    cursor.close()
    conexion.close()

    if espacio is None:
        return jsonify({"error": "Espacio no encontrado"}), 404

    return jsonify(espacio)


@bp.post("/")
def crear():
    datos = request.get_json(force=True)
    nombre    = datos["nombre"]
    ubicacion = datos.get("ubicacion", "")

    conexion = get_connection()
    cursor = conexion.cursor()

    cursor.execute(
        "INSERT INTO espacio (nombre, ubicacion) VALUES (%s, %s)",
        (nombre, ubicacion)
    )
    conexion.commit()
    nuevo_id = cursor.lastrowid

    cursor.close()
    conexion.close()

    return jsonify({"id_espacio": nuevo_id}), 201


@bp.put("/<int:id>")
def actualizar(id):
    datos = request.get_json(force=True)
    nombre    = datos["nombre"]
    ubicacion = datos.get("ubicacion", "")

    conexion = get_connection()
    cursor = conexion.cursor()

    cursor.execute(
        "UPDATE espacio SET nombre = %s, ubicacion = %s WHERE id_espacio = %s",
        (nombre, ubicacion, id)
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
        cursor.execute("DELETE FROM espacio WHERE id_espacio = %s", (id,))
        conexion.commit()
        cursor.close()
        conexion.close()
        return jsonify({"ok": True})

    except Exception:
        cursor.close()
        conexion.close()
        return jsonify({"error": "No se puede eliminar, tiene actividades asociadas"}), 409