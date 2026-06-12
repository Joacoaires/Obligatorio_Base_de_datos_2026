-- Consultas requeridas
-- Sistema de Gestión de Actividades Deportivas Universitarias

USE deportes_universitarios;

-- 1. Actividades con mayor cantidad de inscriptos confirmados
SELECT
    a.nombre                AS actividad,
    d.nombre                AS disciplina,
    COUNT(*)                AS inscriptos_confirmados
FROM actividad a
JOIN inscripcion i ON a.id_actividad = i.id_actividad
JOIN disciplina d  ON a.id_disciplina = d.id_disciplina
WHERE i.estado = 'CONFIRMADA'
GROUP BY a.id_actividad, a.nombre, d.nombre
ORDER BY inscriptos_confirmados DESC;

-- 2. Actividades con cupos disponibles
SELECT
    a.nombre                                            AS actividad,
    a.cupo_maximo,
    COUNT(i.id_inscripcion)                             AS inscriptos,
    a.cupo_maximo - COUNT(i.id_inscripcion)             AS cupos_libres
FROM actividad a
LEFT JOIN inscripcion i
    ON a.id_actividad = i.id_actividad AND i.estado = 'CONFIRMADA'
WHERE a.estado = 'ABIERTA'
GROUP BY a.id_actividad, a.nombre, a.cupo_maximo
HAVING cupos_libres > 0
ORDER BY cupos_libres DESC;

-- 3. Cantidad de inscriptos por disciplina deportiva
SELECT
    d.nombre    AS disciplina,
    COUNT(*)    AS total_inscriptos
FROM disciplina d
JOIN actividad a   ON d.id_disciplina = a.id_disciplina
JOIN inscripcion i ON a.id_actividad  = i.id_actividad
WHERE i.estado = 'CONFIRMADA'
GROUP BY d.id_disciplina, d.nombre
ORDER BY total_inscriptos DESC;

-- 4. Cantidad de inscriptos por carrera y facultad
SELECT
    e.facultad,
    e.carrera,
    COUNT(*) AS total_inscriptos
FROM estudiante e
JOIN inscripcion i ON e.id_estudiante = i.id_estudiante
WHERE i.estado = 'CONFIRMADA'
GROUP BY e.facultad, e.carrera
ORDER BY e.facultad, total_inscriptos DESC;

-- 5. Porcentaje de ocupación de cada actividad
SELECT
    a.nombre                                                        AS actividad,
    a.cupo_maximo,
    COUNT(i.id_inscripcion)                                         AS inscriptos,
    ROUND(COUNT(i.id_inscripcion) * 100.0 / a.cupo_maximo, 2)      AS pct_ocupacion
FROM actividad a
LEFT JOIN inscripcion i
    ON a.id_actividad = i.id_actividad AND i.estado = 'CONFIRMADA'
GROUP BY a.id_actividad, a.nombre, a.cupo_maximo
ORDER BY pct_ocupacion DESC;

-- 6. Porcentaje de asistencia por actividad
SELECT
    a.nombre                                                AS actividad,
    COUNT(ast.id_asistencia)                                AS clases_registradas,
    SUM(CASE WHEN ast.asistio = TRUE THEN 1 ELSE 0 END)    AS presentes,
    ROUND(
        SUM(CASE WHEN ast.asistio = TRUE THEN 1 ELSE 0 END)
        * 100.0 / NULLIF(COUNT(ast.id_asistencia), 0)
    , 2)                                                    AS pct_asistencia
FROM actividad a
LEFT JOIN asistencia ast ON a.id_actividad = ast.id_actividad
GROUP BY a.id_actividad, a.nombre
ORDER BY pct_asistencia DESC;

-- 7. Estudiantes con tres o más inasistencias registradas
SELECT
    e.documento,
    CONCAT(e.nombre, ' ', e.apellido)   AS estudiante,
    e.carrera,
    a.nombre                            AS actividad,
    COUNT(*)                            AS inasistencias
FROM estudiante e
JOIN asistencia ast ON e.id_estudiante = ast.id_estudiante
JOIN actividad a    ON ast.id_actividad = a.id_actividad
WHERE ast.asistio = FALSE
GROUP BY e.id_estudiante, a.id_actividad
HAVING inasistencias >= 3
ORDER BY inasistencias DESC;

-- Consultas adicionales propuestas por el equipo
-- 8. Estudiantes en lista de espera por actividad
SELECT
    a.nombre                            AS actividad,
    CONCAT(e.nombre, ' ', e.apellido)   AS estudiante,
    e.correo,
    i.fecha_inscripcion
FROM inscripcion i
JOIN actividad a   ON i.id_actividad  = a.id_actividad
JOIN estudiante e  ON i.id_estudiante = e.id_estudiante
WHERE i.estado = 'LISTA_ESPERA'
ORDER BY a.nombre, i.fecha_inscripcion;

-- 9. Resumen de actividades por estado
SELECT
    estado,
    COUNT(*) AS cantidad
FROM actividad
GROUP BY estado
ORDER BY cantidad DESC;

-- 10. Actividades sin ningún inscripto confirmado
SELECT
    a.nombre    AS actividad,
    d.nombre    AS disciplina,
    a.estado
FROM actividad a
JOIN disciplina d ON a.id_disciplina = d.id_disciplina
LEFT JOIN inscripcion i
    ON a.id_actividad = i.id_actividad AND i.estado = 'CONFIRMADA'
WHERE i.id_inscripcion IS NULL
ORDER BY a.nombre;
