Las entidades principales:

Hay tres entidades base independientes entre sí: el estudiante (quién), la disciplina (qué tipo de deporte) y el espacio (dónde). A partir de esas tres se construye la actividad, que es la entidad central del sistema porque combina disciplina, espacio, día, horario y cupo.

El flujo principal:

Todo gira alrededor de la inscripción. Un estudiante quiere anotarse a una actividad, y ahí entran las reglas:

Si la actividad no está abierta, se corta todo.
Si está abierta y hay cupo, la inscripción queda confirmada.
Si está abierta pero el cupo está lleno, no se rechaza al estudiante sino que se lo pone en lista de espera.
Si ya estaba anotado, se rechaza.

La lista de espera: 

Cuando alguien cancela su inscripción confirmada, el sistema tiene que mirar automáticamente si hay alguien esperando y promoverlo. Eso no lo hace el usuario, lo hace el sistema solo.

La asistencia:

Es una capa encima de la inscripción. Solo tiene sentido registrar asistencia si el estudiante está confirmado, nunca si está en espera o si nunca se anotó.

Los reportes:

Son consultas de lectura que cruzan las tablas. El único cuidado es siempre filtrar por estado = 'CONFIRMADA' en inscripción cuando se habla de inscriptos reales, y usar NULLIF cuando se calculan porcentajes para no dividir por cero si no hay registros.