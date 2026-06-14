import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { API_URL } from "../config";
import { styles } from "../styles";

export default function ReportesScreen() {
  const [masInscriptos, setMasInscriptos]       = useState([]);
  const [cupos, setCupos]                        = useState([]);
  const [porDisciplina, setPorDisciplina]        = useState([]);
  const [porCarrera, setPorCarrera]              = useState([]);
  const [ocupacion, setOcupacion]                = useState([]);
  const [asistencia, setAsistencia]              = useState([]);
  const [inasistencias, setInasistencias]        = useState([]);
  const [listaEspera, setListaEspera]            = useState([]);
  const [sinInscriptos, setSinInscriptos]        = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/reportes/actividades-mas-inscriptos`)
      .then((res) => res.json())
      .then((data) => setMasInscriptos(data))
      .catch((err) => console.log(err));

    fetch(`${API_URL}/reportes/cupos-disponibles`)
      .then((res) => res.json())
      .then((data) => setCupos(data))
      .catch((err) => console.log(err));

    fetch(`${API_URL}/reportes/inscriptos-por-disciplina`)
      .then((res) => res.json())
      .then((data) => setPorDisciplina(data))
      .catch((err) => console.log(err));

    fetch(`${API_URL}/reportes/inscriptos-por-carrera`)
      .then((res) => res.json())
      .then((data) => setPorCarrera(data))
      .catch((err) => console.log(err));

    fetch(`${API_URL}/reportes/ocupacion-actividades`)
      .then((res) => res.json())
      .then((data) => setOcupacion(data))
      .catch((err) => console.log(err));

    fetch(`${API_URL}/reportes/asistencia-por-actividad`)
      .then((res) => res.json())
      .then((data) => setAsistencia(data))
      .catch((err) => console.log(err));

    fetch(`${API_URL}/reportes/estudiantes-con-inasistencias`)
      .then((res) => res.json())
      .then((data) => setInasistencias(data))
      .catch((err) => console.log(err));

    fetch(`${API_URL}/reportes/lista-espera`)
      .then((res) => res.json())
      .then((data) => setListaEspera(data))
      .catch((err) => console.log(err));

    fetch(`${API_URL}/reportes/actividades-sin-inscriptos`)
      .then((res) => res.json())
      .then((data) => setSinInscriptos(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Reportes</Text>

      {/* 1 */}
      <Text style={styles.section}>Actividades con más inscriptos</Text>
      {masInscriptos.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardTitle}>{item.actividad}</Text>
          <Text style={styles.text}>Disciplina: {item.disciplina}</Text>
          <Text style={styles.text}>Confirmados: {item.inscriptos_confirmados}</Text>
        </View>
      ))}

      {/* 2 */}
      <Text style={styles.section}>Actividades con cupos disponibles</Text>
      {cupos.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardTitle}>{item.actividad}</Text>
          <Text style={styles.text}>Cupo máximo: {item.cupo_maximo}</Text>
          <Text style={styles.text}>Inscriptos: {item.inscriptos}</Text>
          <Text style={styles.text}>Cupos libres: {item.cupos_libres}</Text>
        </View>
      ))}

      {/* 3 */}
      <Text style={styles.section}>Inscriptos por disciplina</Text>
      {porDisciplina.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardTitle}>{item.disciplina}</Text>
          <Text style={styles.text}>Total inscriptos: {item.total_inscriptos}</Text>
        </View>
      ))}

      {/* 4 */}
      <Text style={styles.section}>Inscriptos por carrera y facultad</Text>
      {porCarrera.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardTitle}>{item.carrera}</Text>
          <Text style={styles.text}>Facultad: {item.facultad}</Text>
          <Text style={styles.text}>Total inscriptos: {item.total_inscriptos}</Text>
        </View>
      ))}

      {/* 5 */}
      <Text style={styles.section}>Porcentaje de ocupación</Text>
      {ocupacion.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardTitle}>{item.actividad}</Text>
          <Text style={styles.text}>Cupo máximo: {item.cupo_maximo}</Text>
          <Text style={styles.text}>Inscriptos: {item.inscriptos}</Text>
          <Text style={styles.text}>Ocupación: {item.pct_ocupacion}%</Text>
        </View>
      ))}

      {/* 6 */}
      <Text style={styles.section}>Porcentaje de asistencia</Text>
      {asistencia.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardTitle}>{item.actividad}</Text>
          <Text style={styles.text}>Clases registradas: {item.clases_registradas}</Text>
          <Text style={styles.text}>Presentes: {item.presentes}</Text>
          <Text style={styles.text}>Asistencia: {item.pct_asistencia ?? "Sin datos"}%</Text>
        </View>
      ))}

      {/* 7 */}
      <Text style={styles.section}>Estudiantes con 3 o más inasistencias</Text>
      {inasistencias.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.text}>Sin registros</Text>
        </View>
      ) : (
        inasistencias.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>{item.estudiante}</Text>
            <Text style={styles.text}>Documento: {item.documento}</Text>
            <Text style={styles.text}>Carrera: {item.carrera}</Text>
            <Text style={styles.text}>Actividad: {item.actividad}</Text>
            <Text style={styles.text}>Inasistencias: {item.inasistencias}</Text>
          </View>
        ))
      )}

      {/* 8 - Adicional */}
      <Text style={styles.section}>Lista de espera</Text>
      {listaEspera.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.text}>Sin registros</Text>
        </View>
      ) : (
        listaEspera.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>{item.estudiante}</Text>
            <Text style={styles.text}>Actividad: {item.actividad}</Text>
            <Text style={styles.text}>Correo: {item.correo}</Text>
            <Text style={styles.text}>Fecha: {item.fecha_inscripcion}</Text>
          </View>
        ))
      )}

      {/* 9 - Adicional */}
      <Text style={styles.section}>Actividades sin inscriptos</Text>
      {sinInscriptos.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.text}>Todas las actividades tienen inscriptos</Text>
        </View>
      ) : (
        sinInscriptos.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>{item.actividad}</Text>
            <Text style={styles.text}>Disciplina: {item.disciplina}</Text>
            <Text style={styles.text}>Estado: {item.estado}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}
