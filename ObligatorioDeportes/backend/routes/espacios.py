from flask import Blueprint, request, jsonify
from database.connection import query, execute

bp = Blueprint("espacios", __name__, url_prefix="/api/espacios")

@bp.get("/")
def listar():
    return jsonify(query("SELECT * FROM espacio ORDER BY nombre"))

@bp.get("/<int:id>")
def obtener(id):
    row = query("SELECT * FROM espacio WHERE id_espacio=%s", (id,), fetchone=True)
    return jsonify(row) if row else (jsonify({"error": "No encontrado"}), 404)

@bp.post("/")
def crear():
    d = request.get_json(force=True)
    new_id = execute(
        "INSERT INTO espacio (nombre, ubicacion) VALUES (%s,%s)",
        (d["nombre"], d.get("ubicacion", ""))
    )
    return jsonify({"id_espacio": new_id}), 201

@bp.put("/<int:id>")
def actualizar(id):
    d = request.get_json(force=True)
    fields = {k: d[k] for k in ["nombre","ubicacion"] if k in d}
    set_clause = ", ".join(f"{k}=%s" for k in fields)
    execute(f"UPDATE espacio SET {set_clause} WHERE id_espacio=%s", (*fields.values(), id))
    return jsonify({"ok": True})

@bp.delete("/<int:id>")
def eliminar(id):
    try:
        execute("DELETE FROM espacio WHERE id_espacio=%s", (id,))
        return jsonify({"ok": True})
    except Exception:
        return jsonify({"error": "No se puede eliminar, tiene actividades asociadas"}), 409
