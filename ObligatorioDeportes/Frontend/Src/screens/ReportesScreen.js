import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { API_URL } from "../config";
import { styles } from "../styles";

export default function ReportesScreen() {
  const [cupos, setCupos] = useState([]);
  const [masInscriptos, setMasInscriptos] = useState([]);
  const [porDisciplina, setPorDisciplina] = useState([]);
  const [porCarrera, setPorCarrera] = useState([]);
  const [ocupacion, setOcupacion] = useState([]);
  const [asistencia, setAsistencia] = useState([]);
  const [inasistencias, setInasistencias] = useState([]);
  const [listaEspera, setListaEspera] = useState([]);
  const [sinInscriptos, setSinInscriptos] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/reportes/cupos-disponibles`).then(r => r.json()).then(setCupos);
    fetch(`${API_URL}/reportes/actividades-mas-inscriptos`).then(r => r.json()).then(setMasInscriptos);
    fetch(`${API_URL}/reportes/inscriptos-por-disciplina`).then(r => r.json()).then(setPorDisciplina);
    fetch(`${API_URL}/reportes/inscriptos-por-carrera`).then(r => r.json()).then(setPorCarrera);
    fetch(`${API_URL}/reportes/ocupacion-actividades`).then(r => r.json()).then(setOcupacion);
    fetch(`${API_URL}/reportes/asistencia-por-actividad`).then(r => r.json()).then(setAsistencia);
    fetch(`${API_URL}/reportes/estudiantes-con-inasistencias`).then(r => r.json()).then(setInasistencias);
    fetch(`${API_URL}/reportes/lista-espera`).then(r => r.json()).then(setListaEspera);
    fetch(`${API_URL}/reportes/actividades-sin-inscriptos`).then(r => r.json()).then(setSinInscriptos);
  }, []);

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Reportes</Text>

      <Text style={styles.section}>Cupos disponibles</Text>
      {cupos.map((item, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.cardTitle}>{item.actividad}</Text>
          <Text style={styles.text}>Cupo máximo: {item.cupo_maximo}</Text>
          <Text style={styles.text}>Inscriptos: {item.inscriptos}</Text>
          <Text style={styles.text}>Cupos libres: {item.cupos_libres}</Text>
        </View>
      ))}

      <Text style={styles.section}>Actividades más inscriptas</Text>
      {masInscriptos.map((item, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.cardTitle}>{item.actividad}</Text>
          <Text style={styles.text}>Disciplina: {item.disciplina}</Text>
          <Text style={styles.text}>Confirmados: {item.inscriptos_confirmados}</Text>
        </View>
      ))}

      <Text style={styles.section}>Inscriptos por disciplina</Text>
      {porDisciplina.map((item, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.cardTitle}>{item.disciplina}</Text>
          <Text style={styles.text}>Total inscriptos: {item.total_inscriptos}</Text>
        </View>
      ))}

      <Text style={styles.section}>Inscriptos por carrera y facultad</Text>
      {porCarrera.map((item, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.cardTitle}>{item.carrera}</Text>
          <Text style={styles.text}>Facultad: {item.facultad}</Text>
          <Text style={styles.text}>Total inscriptos: {item.total_inscriptos}</Text>
        </View>
      ))}

      <Text style={styles.section}>Ocupación de actividades</Text>
      {ocupacion.map((item, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.cardTitle}>{item.actividad}</Text>
          <Text style={styles.text}>Cupo máximo: {item.cupo_maximo}</Text>
          <Text style={styles.text}>Inscriptos: {item.inscriptos}</Text>
          <Text style={styles.text}>Ocupación: {item.pct_ocupacion}%</Text>
        </View>
      ))}

      <Text style={styles.section}>Asistencia por actividad</Text>
      {asistencia.map((item, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.cardTitle}>{item.actividad}</Text>
          <Text style={styles.text}>Clases registradas: {item.clases_registradas}</Text>
          <Text style={styles.text}>Presentes: {item.presentes}</Text>
          <Text style={styles.text}>Asistencia: {item.pct_asistencia || 0}%</Text>
        </View>
      ))}

      <Text style={styles.section}>Estudiantes con 3 o más inasistencias</Text>
      {inasistencias.map((item, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.cardTitle}>{item.estudiante}</Text>
          <Text style={styles.text}>Documento: {item.documento}</Text>
          <Text style={styles.text}>Carrera: {item.carrera}</Text>
          <Text style={styles.text}>Actividad: {item.actividad}</Text>
          <Text style={styles.text}>Inasistencias: {item.inasistencias}</Text>
        </View>
      ))}

      <Text style={styles.section}>Lista de espera</Text>
      {listaEspera.map((item, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.cardTitle}>{item.estudiante}</Text>
          <Text style={styles.text}>Actividad: {item.actividad}</Text>
          <Text style={styles.text}>Correo: {item.correo}</Text>
          <Text style={styles.text}>Fecha: {item.fecha_inscripcion}</Text>
        </View>
      ))}

      <Text style={styles.section}>Actividades sin inscriptos confirmados</Text>
      {sinInscriptos.map((item, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.cardTitle}>{item.actividad}</Text>
          <Text style={styles.text}>Disciplina: {item.disciplina}</Text>
          <Text style={styles.text}>Estado: {item.estado}</Text>
        </View>
      ))}
    </ScrollView>
  );
}