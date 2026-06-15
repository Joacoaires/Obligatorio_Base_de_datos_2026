# Sistema de Gestión de Actividades Deportivas Universitarias

## Descripción

Este proyecto fue desarrollado para el obligatorio de Base de Datos 2026. El objetivo del sistema es permitir gestionar las actividades deportivas que ofrece la universidad, reemplazando el uso de planillas por una aplicación que facilite el control de cupos, inscripciones, asistencias y reportes.

El sistema permite administrar estudiantes, disciplinas deportivas, espacios deportivos, actividades, inscripciones y asistencias. Además, incluye distintos reportes que ayudan a visualizar información relevante sobre las actividades y los estudiantes.

## Diseño general

Las entidades principales del sistema son estudiante, disciplina y espacio. A partir de ellas se crea la actividad deportiva, que es la entidad central del sistema ya que relaciona una disciplina con un espacio físico, un día, un horario y una cantidad máxima de participantes.

El flujo principal gira alrededor de las inscripciones. Cuando un estudiante intenta inscribirse a una actividad, el sistema verifica que la actividad se encuentre abierta y que el estudiante no esté ya inscripto. Si existe cupo disponible, la inscripción queda confirmada. En caso contrario, el estudiante pasa automáticamente a una lista de espera.

También se implementó el registro de asistencias. Solamente es posible registrar asistencia de estudiantes cuya inscripción se encuentre confirmada, evitando inconsistencias en los datos.

Por último, el sistema incorpora distintos reportes que permiten consultar información estadística sobre las actividades deportivas y la participación de los estudiantes.

## Tecnologías utilizadas

Para el desarrollo del proyecto se utilizaron las siguientes tecnologías:

* Python
* Flask
* MySQL
* React Native con Expo
* Docker y Docker Compose

## Requisitos

Antes de ejecutar el sistema es necesario contar con:

* Docker Desktop
* Python 3.12 o superior
* Node.js y npm

Además, para el backend deben instalarse las siguientes dependencias:

```bash
pip install flask flask-cors mysql-connector-python
```

Para el frontend, ubicarse en la carpeta correspondiente y ejecutar:

```bash
npm install
```

## Ejecución del sistema

### 1. Levantar la base de datos

Desde la carpeta raíz del proyecto ejecutar:

```bash
docker compose up -d
```

Esto iniciará el contenedor de MySQL y cargará automáticamente el script de creación de la base de datos.

### 2. Ejecutar el backend

Abrir una terminal dentro de la carpeta Backend y ejecutar:

```bash
python app.py
```

El servidor quedará disponible en:

```txt
http://127.0.0.1:5000
```

### 3. Ejecutar el frontend

Abrir otra terminal dentro de la carpeta Frontend y ejecutar:

```bash
npm start
```

Cuando Expo finalice la carga, presionar la tecla:

```txt
w
```

para abrir la versión web de la aplicación.

## Funcionalidades implementadas

El sistema permite:

* Gestión de estudiantes.
* Gestión de disciplinas deportivas.
* Gestión de espacios deportivos.
* Gestión de actividades deportivas.
* Inscripción de estudiantes a actividades.
* Gestión automática de lista de espera.
* Registro de asistencias.
* Consulta de reportes.

## Reglas de negocio implementadas

Se controlan las siguientes reglas:

* Solo se permiten inscripciones en actividades abiertas.
* No se puede superar el cupo máximo de una actividad.
* Cuando una actividad no tiene cupos disponibles, la inscripción pasa automáticamente a lista de espera.
* Un estudiante no puede inscribirse dos veces en la misma actividad.
* Solo se registran asistencias para estudiantes con inscripción confirmada.
* Las actividades cerradas, finalizadas o canceladas no aceptan nuevas inscripciones.

## Reportes

El sistema incluye reportes para consultar:

* Actividades con mayor cantidad de inscriptos confirmados.
* Actividades con cupos disponibles.
* Cantidad de inscriptos por disciplina.
* Cantidad de inscriptos por carrera y facultad.
* Porcentaje de ocupación de actividades.
* Porcentaje de asistencia por actividad.
* Estudiantes con inasistencias registradas.
* Consultas adicionales definidas por el equipo.

## Estructura del proyecto

El proyecto se encuentra dividido en dos partes principales:

* Backend: desarrollado en Python utilizando Flask.
* Frontend: desarrollado con React Native y Expo.

Además se incluye el script SQL de creación de la base de datos y la configuración necesaria para ejecutar el sistema mediante Docker.

## Autores

Proyecto realizado para el curso de Base de Datos 2026.
