-- Sistema de Gestión de Actividades Deportivas Universitarias
-- Schema + Datos maestros

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE DATABASE IF NOT EXISTS deportes_universitarios
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE deportes_universitarios;

-- DISCIPLINA
CREATE TABLE IF NOT EXISTS disciplina (
    id_disciplina INT AUTO_INCREMENT PRIMARY KEY,
    nombre        VARCHAR(100) NOT NULL UNIQUE
);

-- ESPACIO
CREATE TABLE IF NOT EXISTS espacio (
    id_espacio  INT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    ubicacion   VARCHAR(200)
);

-- ESTUDIANTE
CREATE TABLE IF NOT EXISTS estudiante (
    id_estudiante INT AUTO_INCREMENT PRIMARY KEY,
    documento     VARCHAR(20)  NOT NULL UNIQUE,
    nombre        VARCHAR(100) NOT NULL,
    apellido      VARCHAR(100) NOT NULL,
    correo        VARCHAR(150) NOT NULL UNIQUE,
    carrera       VARCHAR(150) NOT NULL,
    facultad      VARCHAR(150) NOT NULL
);

-- ACTIVIDAD
CREATE TABLE IF NOT EXISTS actividad (
    id_actividad  INT AUTO_INCREMENT PRIMARY KEY,
    nombre        VARCHAR(150) NOT NULL,
    id_disciplina INT          NOT NULL,
    id_espacio    INT          NOT NULL,
    cupo_maximo   INT          NOT NULL CHECK (cupo_maximo > 0),
    dia           VARCHAR(20)  NOT NULL,
    hora          TIME         NOT NULL,
    estado        ENUM('ABIERTA','CERRADA','FINALIZADA','CANCELADA') NOT NULL DEFAULT 'ABIERTA',
    CONSTRAINT fk_actividad_disciplina FOREIGN KEY (id_disciplina) REFERENCES disciplina(id_disciplina),
    CONSTRAINT fk_actividad_espacio    FOREIGN KEY (id_espacio)    REFERENCES espacio(id_espacio)
);

-- INSCRIPCION
CREATE TABLE IF NOT EXISTS inscripcion (
    id_inscripcion   INT AUTO_INCREMENT PRIMARY KEY,
    id_estudiante    INT  NOT NULL,
    id_actividad     INT  NOT NULL,
    fecha_inscripcion DATE NOT NULL DEFAULT (CURRENT_DATE),
    estado           ENUM('CONFIRMADA','LISTA_ESPERA') NOT NULL,
    CONSTRAINT fk_inscripcion_estudiante FOREIGN KEY (id_estudiante) REFERENCES estudiante(id_estudiante),
    CONSTRAINT fk_inscripcion_actividad  FOREIGN KEY (id_actividad)  REFERENCES actividad(id_actividad),
    CONSTRAINT uq_inscripcion            UNIQUE (id_estudiante, id_actividad)
);

-- ASISTENCIA
CREATE TABLE IF NOT EXISTS asistencia (
    id_asistencia INT AUTO_INCREMENT PRIMARY KEY,
    id_estudiante INT  NOT NULL,
    id_actividad  INT  NOT NULL,
    fecha         DATE NOT NULL,
    asistio       BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_asistencia_estudiante FOREIGN KEY (id_estudiante) REFERENCES estudiante(id_estudiante),
    CONSTRAINT fk_asistencia_actividad  FOREIGN KEY (id_actividad)  REFERENCES actividad(id_actividad),
    CONSTRAINT uq_asistencia            UNIQUE (id_estudiante, id_actividad, fecha)
);

-- DATOS MAESTROS

INSERT INTO disciplina (nombre) VALUES
  ('Fútbol'),
  ('Básquetbol'),
  ('Atletismo'),
  ('Vóleibol'),
  ('Yoga'),
  ('Funcional'),
  ('Gimnasio');

INSERT INTO espacio (nombre, ubicacion) VALUES
  ('Gimnasio Central',  'Edificio A, planta baja'),
  ('Cancha 1',          'Predio deportivo norte'),
  ('Cancha 2',          'Predio deportivo norte'),
  ('Cancha 3',          'Predio deportivo sur'),
  ('Sala de Yoga',      'Edificio B, piso 2'),
  ('Pista de Atletismo','Predio deportivo sur');

INSERT INTO actividad (nombre, id_disciplina, id_espacio, cupo_maximo, dia, hora, estado) VALUES
  ('Fútbol recreativo mixto',   1, 2, 20, 'Lunes',    '18:00:00', 'ABIERTA'),
  ('Básquetbol inicial',        2, 3, 15, 'Martes',   '17:00:00', 'ABIERTA'),
  ('Atletismo inicial',         3, 6, 25, 'Miércoles','08:00:00', 'ABIERTA'),
  ('Vóleibol avanzado',         4, 4, 12, 'Jueves',   '19:00:00', 'ABIERTA'),
  ('Yoga turno mañana',         5, 5, 10, 'Viernes',  '07:30:00', 'ABIERTA'),
  ('Funcional turno mañana',    6, 1, 15, 'Lunes',    '07:00:00', 'ABIERTA'),
  ('Funcional turno tarde',     6, 1, 15, 'Miércoles','18:00:00', 'ABIERTA'),
  ('Gimnasio libre',            7, 1, 30, 'Lunes',    '09:00:00', 'ABIERTA');

INSERT INTO estudiante (documento, nombre, apellido, correo, carrera, facultad) VALUES
  ('12345678','Ana',     'García',    'ana.garcia@universidad.edu',    'Ingeniería en Sistemas', 'Facultad de Ingeniería'),
  ('23456789','Bruno',   'Martínez',  'bruno.martinez@universidad.edu','Contador Público',       'Facultad de Ciencias Económicas'),
  ('34567890','Camila',  'López',     'camila.lopez@universidad.edu',  'Medicina',               'Facultad de Medicina'),
  ('45678901','Diego',   'Fernández', 'diego.fernandez@universidad.edu','Derecho',               'Facultad de Derecho'),
  ('56789012','Elena',   'Torres',    'elena.torres@universidad.edu',  'Arquitectura',           'Facultad de Arquitectura');
