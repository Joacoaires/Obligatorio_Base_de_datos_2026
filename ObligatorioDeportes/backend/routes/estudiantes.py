from flask import Blueprint, request, jsonify
from database.connection import query, execute

bp = Blueprint("estudiantes", __name__, url_prefix="/api/estudiantes")

@bp.get("/")
def listar():
    return jsonify(query("SELECT * FROM estudiante ORDER BY apellido, nombre"))

@bp.get("/<int:id>")
def obtener(id):
    row = query("SELECT * FROM estudiante WHERE id_estudiante=%s", (id,), fetchone=True)
    return jsonify(row) if row else (jsonify({"error": "No encontrado"}), 404)

@bp.post("/")
def crear():
    d = request.get_json(force=True)
    try:
        new_id = execute(
            "INSERT INTO estudiante (documento, nombre, apellido, correo, carrera, facultad) VALUES (%s,%s,%s,%s,%s,%s)",
            (d["documento"], d["nombre"], d["apellido"], d["correo"], d["carrera"], d["facultad"])
        )
        return jsonify({"id_estudiante": new_id}), 201
    except Exception as e:
        return jsonify({"error": "Documento o correo ya registrado" if "Duplicate" in str(e) else str(e)}), 409

@bp.put("/<int:id>")
def actualizar(id):
    d = request.get_json(force=True)
    fields = {k: d[k] for k in ["documento","nombre","apellido","correo","carrera","facultad"] if k in d}
    set_clause = ", ".join(f"{k}=%s" for k in fields)
    execute(f"UPDATE estudiante SET {set_clause} WHERE id_estudiante=%s", (*fields.values(), id))
    return jsonify({"ok": True})

@bp.delete("/<int:id>")
def eliminar(id):
    execute("DELETE FROM estudiante WHERE id_estudiante=%s", (id,))
    return jsonify({"ok": True})
