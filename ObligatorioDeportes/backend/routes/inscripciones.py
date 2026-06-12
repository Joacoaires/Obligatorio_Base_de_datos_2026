from flask import Blueprint, request, jsonify
from database.connection import query, execute
from datetime import date

bp = Blueprint("inscripciones", __name__, url_prefix="/api/inscripciones")

@bp.get("/")
def listar():
    actividad_id = request.args.get("actividad")
    estudiante_id = request.args.get("estudiante")
    sql = """SELECT i.*, CONCAT(e.nombre,' ',e.apellido) AS estudiante, a.nombre AS actividad
             FROM inscripcion i
             JOIN estudiante e ON i.id_estudiante = e.id_estudiante
             JOIN actividad  a ON i.id_actividad  = a.id_actividad
             WHERE 1=1"""
    params = []
    if actividad_id:
        sql += " AND i.id_actividad=%s";  params.append(actividad_id)
    if estudiante_id:
        sql += " AND i.id_estudiante=%s"; params.append(estudiante_id)
    return jsonify(query(sql + " ORDER BY i.fecha_inscripcion DESC", tuple(params)))

@bp.post("/")
def inscribir():
    d = request.get_json(force=True)
    id_est, id_act = d.get("id_estudiante"), d.get("id_actividad")

    act = query("SELECT estado, cupo_maximo FROM actividad WHERE id_actividad=%s", (id_act,), fetchone=True)
    if not act:
        return jsonify({"error": "Actividad no encontrada"}), 404
    if act["estado"] != "ABIERTA":
        return jsonify({"error": f"Actividad no abierta (estado: {act['estado']})"}), 409

    if query("SELECT id_inscripcion FROM inscripcion WHERE id_estudiante=%s AND id_actividad=%s", (id_est, id_act), fetchone=True):
        return jsonify({"error": "El estudiante ya está inscripto"}), 409

    confirmados = query("SELECT COUNT(*) AS c FROM inscripcion WHERE id_actividad=%s AND estado='CONFIRMADA'", (id_act,), fetchone=True)["c"]
    estado = "CONFIRMADA" if confirmados < act["cupo_maximo"] else "LISTA_ESPERA"

    new_id = execute(
        "INSERT INTO inscripcion (id_estudiante, id_actividad, fecha_inscripcion, estado) VALUES (%s,%s,%s,%s)",
        (id_est, id_act, date.today().isoformat(), estado)
    )
    return jsonify({"id_inscripcion": new_id, "estado": estado}), 201

@bp.delete("/<int:id>")
def cancelar(id):
    insc = query("SELECT * FROM inscripcion WHERE id_inscripcion=%s", (id,), fetchone=True)
    if not insc:
        return jsonify({"error": "No encontrada"}), 404

    execute("DELETE FROM inscripcion WHERE id_inscripcion=%s", (id,))

    if insc["estado"] == "CONFIRMADA":
        sig = query(
            "SELECT id_inscripcion FROM inscripcion WHERE id_actividad=%s AND estado='LISTA_ESPERA' ORDER BY fecha_inscripcion ASC LIMIT 1",
            (insc["id_actividad"],), fetchone=True
        )
        if sig:
            execute("UPDATE inscripcion SET estado='CONFIRMADA' WHERE id_inscripcion=%s", (sig["id_inscripcion"],))

    return jsonify({"ok": True})
