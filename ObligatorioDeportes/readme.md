# Sistema de Gestión de Actividades Deportivas Universitarias

## Descripción

Sistema para administrar actividades deportivas universitarias: estudiantes, disciplinas, espacios físicos, inscripciones y asistencias, con manejo de cupos y listas de espera.

---

## Tecnologías utilizadas

- MySQL 8.0
- Python 3.12 y Flask
- React Native con Expo (frontend mobile)
- Docker y Docker Compose

## Dependencias del backend

```
flask
flask-cors
mysql-connector-python
```

Instalación manual:

```bash
pip install flask flask-cors mysql-connector-python
```

---

## Cómo ejecutar el proyecto

### Opción 1: Docker (recomendado)

Requisitos: tener Docker Desktop instalado y corriendo.

```bash
docker-compose up --build
```

Esto levanta MySQL y el backend automáticamente.

- API disponible en: http://localhost:5000

Para detener:

```bash
docker-compose down
```

Para reiniciar la base de datos desde cero:

```bash
docker-compose down -v
```

---

### Opción 2: Ejecución local

#### Base de datos

```bash
mysql -u root -p < sql/schema.sql
```

#### Backend

```bash
cd backend
pip install flask flask-cors mysql-connector-python
python app.py
```

La API queda disponible en http://localhost:5000

#### Frontend (React Native)

```bash
cd Frontend
npm install
npx expo start
```

Escanear el QR con la app Expo Go en el celular, o presionar `w` para abrir en el navegador.

> Antes de correr el frontend, verificar que en `Src/config.js` la URL apunte al backend correcto.

---

## Organización del proyecto

```
ObligatorioDeportes/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── database/
│   │   └── connection.py
│   └── routes/
│       ├── estudiantes.py
│       ├── disciplinas.py
│       ├── espacios.py
│       ├── actividades.py
│       ├── inscripciones.py
│       ├── asistencias.py
│       └── reportes.py
├── Frontend/
│   ├── App.js
│   ├── Src/
│   │   ├── config.js
│   │   ├── styles.js
│   │   ├── components/
│   │   │   └── Navbar.js
│   │   └── screens/
│   │       ├── BienvenidaScreen.js
│   │       ├── HomeScreen.js
│   │       ├── EstudiantesScreen.js
│   │       ├── DisciplinasScreen.js
│   │       ├── EspaciosScreen.js
│   │       ├── ActividadesScreen.js
│   │       ├── InscripcionesScreen.js
│   │       ├── AsistenciasScreen.js
│   │       └── ReportesScreen.js
├── sql/
│   ├── schema.sql
│   └── queries.sql
└── docker-compose.yml
```

---

## Reglas de negocio implementadas

- Solo se puede inscribir en actividades abiertas.
- Al alcanzar el cupo máximo, las nuevas inscripciones pasan a lista de espera.
- Al cancelarse una inscripción confirmada, el primero en lista de espera queda confirmado automáticamente.
- No se permiten inscripciones duplicadas para la misma actividad.
- Las asistencias solo se registran para inscripciones confirmadas.
- Actividades canceladas o finalizadas no aceptan nuevas inscripciones.

---

## Consultas y reportes implementados

1. Actividades con mayor cantidad de inscriptos confirmados
2. Actividades con cupos disponibles
3. Inscriptos por disciplina deportiva
4. Inscriptos por carrera y facultad
5. Porcentaje de ocupación por actividad
6. Porcentaje de asistencia por actividad
7. Estudiantes con tres o más inasistencias

Consultas adicionales propuestas por el equipo:

8. Estudiantes en lista de espera por actividad
9. Resumen de actividades por estado
10. Actividades sin ningún inscripto confirmado

---

## Decisiones de diseño

Se utilizó un `ENUM` para el estado de la actividad y de la inscripción para garantizar que solo entren valores válidos a nivel de base de datos. Se agregó un `UNIQUE` sobre la combinación estudiante-actividad en la tabla inscripcion como segunda línea de defensa contra duplicados, además de la validación en el backend. La lógica de lista de espera y promoción automática se maneja completamente en el backend para asegurar consistencia.

El frontend fue desarrollado en React Native con Expo, con pantalla de bienvenida y selección de rol (administrador, estudiante, profesor), mostrando distintas secciones según el perfil.

---

## Casos de prueba realizados

- Inscripción con cupo disponible → queda CONFIRMADA
- Inscripción con cupo lleno → queda en LISTA_ESPERA
- Cancelación de inscripción confirmada → el primero en lista de espera pasa a CONFIRMADA
- Intento de doble inscripción → error
- Registro de asistencia de inscripto confirmado → OK
- Registro de asistencia de estudiante en lista de espera → error
- Inscripción en actividad cerrada o cancelada → error