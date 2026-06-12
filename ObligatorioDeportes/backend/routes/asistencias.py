from flask import Blueprint, request, jsonify
from database.connection import query, execute
from datetime import date

bp = Blueprint("asistencias", __name__, url_prefix="/api/asistencias")

@bp.get("/")
def listar():
    actividad_id = request.args.get("actividad")
    fecha = request.args.get("fecha")
    sql = """SELECT ast.*, CONCAT(e.nombre,' ',e.apellido) AS estudiante, a.nombre AS actividad
             FROM asistencia ast
             JOIN estudiante e ON ast.id_estudiante = e.id_estudiante
             JOIN actividad  a ON ast.id_actividad  = a.id_actividad
             WHERE 1=1"""
    params = []
    if actividad_id:
        sql += " AND ast.id_actividad=%s"; params.append(actividad_id)
    if fecha:
        sql += " AND ast.fecha=%s";        params.append(fecha)
    return jsonify(query(sql + " ORDER BY ast.fecha DESC, e.apellido", tuple(params)))

@bp.post("/")
def registrar():
    d = request.get_json(force=True)
    id_est, id_act = d.get("id_estudiante"), d.get("id_actividad")
    fecha   = d.get("fecha", date.today().isoformat())
    asistio = d.get("asistio", True)

    insc = query("SELECT estado FROM inscripcion WHERE id_estudiante=%s AND id_actividad=%s", (id_est, id_act), fetchone=True)
    if not insc:
        return jsonify({"error": "El estudiante no está inscripto"}), 409
    if insc["estado"] != "CONFIRMADA":
        return jsonify({"error": "Solo se registra asistencia de inscripciones confirmadas"}), 409

    new_id = execute(
        "INSERT INTO asistencia (id_estudiante, id_actividad, fecha, asistio) VALUES (%s,%s,%s,%s) ON DUPLICATE KEY UPDATE asistio=%s",
        (id_est, id_act, fecha, asistio, asistio)
    )
    return jsonify({"id_asistencia": new_id}), 201

@bp.delete("/<int:id>")
def eliminar(id):
    execute("DELETE FROM asistencia WHERE id_asistencia=%s", (id,))
    return jsonify({"ok": True})
