from flask import Blueprint, jsonify
from database.connection import query

bp = Blueprint("reportes", __name__, url_prefix="/api/reportes")

@bp.get("/actividades-mas-inscriptos")
def mas_inscriptos():
    return jsonify(query(
        """SELECT a.nombre AS actividad, d.nombre AS disciplina, COUNT(*) AS inscriptos_confirmados
           FROM actividad a
           JOIN inscripcion i ON a.id_actividad  = i.id_actividad
           JOIN disciplina d  ON a.id_disciplina = d.id_disciplina
           WHERE i.estado='CONFIRMADA'
           GROUP BY a.id_actividad, a.nombre, d.nombre
           ORDER BY inscriptos_confirmados DESC"""
    ))

@bp.get("/cupos-disponibles")
def cupos_disponibles():
    return jsonify(query(
        """SELECT a.nombre AS actividad, a.cupo_maximo,
                  COUNT(i.id_inscripcion) AS inscriptos,
                  a.cupo_maximo - COUNT(i.id_inscripcion) AS cupos_libres
           FROM actividad a
           LEFT JOIN inscripcion i ON a.id_actividad=i.id_actividad AND i.estado='CONFIRMADA'
           WHERE a.estado='ABIERTA'
           GROUP BY a.id_actividad, a.nombre, a.cupo_maximo
           HAVING cupos_libres > 0
           ORDER BY cupos_libres DESC"""
    ))

@bp.get("/inscriptos-por-disciplina")
def por_disciplina():
    return jsonify(query(
        """SELECT d.nombre AS disciplina, COUNT(*) AS total_inscriptos
           FROM disciplina d
           JOIN actividad a   ON d.id_disciplina=a.id_disciplina
           JOIN inscripcion i ON a.id_actividad =i.id_actividad
           WHERE i.estado='CONFIRMADA'
           GROUP BY d.id_disciplina, d.nombre
           ORDER BY total_inscriptos DESC"""
    ))

@bp.get("/inscriptos-por-carrera")
def por_carrera():
    return jsonify(query(
        """SELECT e.facultad, e.carrera, COUNT(*) AS total_inscriptos
           FROM estudiante e
           JOIN inscripcion i ON e.id_estudiante=i.id_estudiante
           WHERE i.estado='CONFIRMADA'
           GROUP BY e.facultad, e.carrera
           ORDER BY e.facultad, total_inscriptos DESC"""
    ))

@bp.get("/ocupacion-actividades")
def ocupacion():
    return jsonify(query(
        """SELECT a.nombre AS actividad, a.cupo_maximo,
                  COUNT(i.id_inscripcion) AS inscriptos,
                  ROUND(COUNT(i.id_inscripcion)*100.0/a.cupo_maximo, 2) AS pct_ocupacion
           FROM actividad a
           LEFT JOIN inscripcion i ON a.id_actividad=i.id_actividad AND i.estado='CONFIRMADA'
           GROUP BY a.id_actividad, a.nombre, a.cupo_maximo
           ORDER BY pct_ocupacion DESC"""
    ))

@bp.get("/asistencia-por-actividad")
def asistencia():
    return jsonify(query(
        """SELECT a.nombre AS actividad,
                  COUNT(ast.id_asistencia) AS clases_registradas,
                  SUM(CASE WHEN ast.asistio=1 THEN 1 ELSE 0 END) AS presentes,
                  ROUND(SUM(CASE WHEN ast.asistio=1 THEN 1 ELSE 0 END)*100.0/NULLIF(COUNT(ast.id_asistencia),0), 2) AS pct_asistencia
           FROM actividad a
           LEFT JOIN asistencia ast ON a.id_actividad=ast.id_actividad
           GROUP BY a.id_actividad, a.nombre
           ORDER BY pct_asistencia DESC"""
    ))

@bp.get("/estudiantes-con-inasistencias")
def con_inasistencias():
    return jsonify(query(
        """SELECT e.documento, CONCAT(e.nombre,' ',e.apellido) AS estudiante,
                  e.carrera, a.nombre AS actividad, COUNT(*) AS inasistencias
           FROM estudiante e
           JOIN asistencia ast ON e.id_estudiante=ast.id_estudiante
           JOIN actividad a    ON ast.id_actividad=a.id_actividad
           WHERE ast.asistio=0
           GROUP BY e.id_estudiante, a.id_actividad
           HAVING inasistencias >= 3
           ORDER BY inasistencias DESC"""
    ))

@bp.get("/lista-espera")
def lista_espera():
    return jsonify(query(
        """SELECT a.nombre AS actividad, CONCAT(e.nombre,' ',e.apellido) AS estudiante,
                  e.correo, i.fecha_inscripcion
           FROM inscripcion i
           JOIN actividad  a ON i.id_actividad =a.id_actividad
           JOIN estudiante e ON i.id_estudiante=e.id_estudiante
           WHERE i.estado='LISTA_ESPERA'
           ORDER BY a.nombre, i.fecha_inscripcion"""
    ))

@bp.get("/actividades-sin-inscriptos")
def sin_inscriptos():
    return jsonify(query(
        """SELECT a.nombre AS actividad, d.nombre AS disciplina, a.estado
           FROM actividad a
           JOIN disciplina d ON a.id_disciplina=d.id_disciplina
           LEFT JOIN inscripcion i ON a.id_actividad=i.id_actividad AND i.estado='CONFIRMADA'
           WHERE i.id_inscripcion IS NULL
           ORDER BY a.nombre"""
    ))
