from flask import Blueprint, request, jsonify
from database.connection import query, execute

bp = Blueprint("disciplinas", __name__, url_prefix="/api/disciplinas")

@bp.get("/")
def listar():
    return jsonify(query("SELECT * FROM disciplina ORDER BY nombre"))

@bp.get("/<int:id>")
def obtener(id):
    # Buscamos disciplina por id.
    row = query("SELECT * FROM disciplina WHERE id_disciplina=%s", (id,), fetchone=True)
    return jsonify(row) if row else (jsonify({"error": "No encontrada"}), 404)

@bp.post("/")
def crear():
    d = request.get_json(force=True)
    try:
        # Creamos nueva disciplina, el nombre debe ser único.
        new_id = execute("INSERT INTO disciplina (nombre) VALUES (%s)", (d["nombre"],))
        return jsonify({"id_disciplina": new_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.put("/<int:id>")
def actualizar(id):
    d = request.get_json(force=True)
    execute("UPDATE disciplina SET nombre=%s WHERE id_disciplina=%s", (d["nombre"], id))
    return jsonify({"ok": True})

@bp.delete("/<int:id>")
def eliminar(id):
    # No se puede eliminar si hayh actividades asociadas.
    try:
        execute("DELETE FROM disciplina WHERE id_disciplina=%s", (id,))
        return jsonify({"ok": True})
    except Exception:
        return jsonify({"error": "No se puede eliminar, tiene actividades asociadas"}), 409
