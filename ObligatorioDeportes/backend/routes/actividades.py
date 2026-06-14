from flask import Blueprint, request, jsonify
from database.connection import query, execute

bp = Blueprint("actividades", __name__, url_prefix="/api/actividades")

# Consultamos la base para obtener las actividades junto con su disciplina y espacio
JOIN = """SELECT a.*, d.nombre AS disciplina, e.nombre AS espacio
          FROM actividad a
          JOIN disciplina d ON a.id_disciplina = d.id_disciplina
          JOIN espacio e    ON a.id_espacio    = e.id_espacio"""

@bp.get("/")
def listar():
    return jsonify(query(JOIN + " ORDER BY a.nombre"))

@bp.get("/<int:id>")
def obtener(id):
    row = query(JOIN + " WHERE a.id_actividad=%s", (id,), fetchone=True)
    return jsonify(row) if row else (jsonify({"error": "No encontrada"}), 404)

@bp.post("/")
def crear():
    d = request.get_json(force=True)
    new_id = execute(
        # El estado por defecto es abierto.
        "INSERT INTO actividad (nombre, id_disciplina, id_espacio, cupo_maximo, dia, hora, estado) VALUES (%s,%s,%s,%s,%s,%s,%s)",
        (d["nombre"], d["id_disciplina"], d["id_espacio"], d["cupo_maximo"], d["dia"], d["hora"], d.get("estado","ABIERTA").upper())
    )
    return jsonify({"id_actividad": new_id}), 201

@bp.put("/<int:id>")
def actualizar(id):
    d = request.get_json(force=True)
    fields = {k: d[k] for k in ["nombre","id_disciplina","id_espacio","cupo_maximo","dia","hora","estado"] if k in d}
    set_clause = ", ".join(f"{k}=%s" for k in fields)
    execute(f"UPDATE actividad SET {set_clause} WHERE id_actividad=%s", (*fields.values(), id))
    return jsonify({"ok": True})

@bp.delete("/<int:id>")
def eliminar(id):
    try:
        execute("DELETE FROM actividad WHERE id_actividad=%s", (id,))
        return jsonify({"ok": True})
    except Exception:
        return jsonify({"error": "No se puede eliminar, tiene inscripciones o asistencias"}), 409
