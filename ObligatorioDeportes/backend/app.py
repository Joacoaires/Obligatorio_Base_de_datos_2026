from flask import Flask
from flask_cors import CORS
from routes.estudiantes   import bp as bp_estudiantes
from routes.disciplinas   import bp as bp_disciplinas
from routes.espacios      import bp as bp_espacios
from routes.actividades   import bp as bp_actividades
from routes.inscripciones import bp as bp_inscripciones
from routes.asistencias   import bp as bp_asistencias
from routes.reportes      import bp as bp_reportes

app = Flask(__name__)
CORS(app)

app.register_blueprint(bp_estudiantes)
app.register_blueprint(bp_disciplinas)
app.register_blueprint(bp_espacios)
app.register_blueprint(bp_actividades)
app.register_blueprint(bp_inscripciones)
app.register_blueprint(bp_asistencias)
app.register_blueprint(bp_reportes)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
