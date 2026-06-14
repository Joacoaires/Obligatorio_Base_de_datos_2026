import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { API_URL } from "../config";
import { styles } from "../styles";

export default function ReportesScreen() {
  const [cupos, setCupos] = useState([]);
  const [masInscriptos, setMasInscriptos] = useState([]);
  const [porDisciplina, setPorDisciplina] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/reportes/cupos-disponibles`)
      .then((res) => res.json())
      .then((data) => setCupos(data))
      .catch((err) => console.log(err));

    fetch(`${API_URL}/reportes/actividades-mas-inscriptos`)
      .then((res) => res.json())
      .then((data) => setMasInscriptos(data))
      .catch((err) => console.log(err));

    fetch(`${API_URL}/reportes/inscriptos-por-disciplina`)
      .then((res) => res.json())
      .then((data) => setPorDisciplina(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Reportes</Text>

      <Text style={styles.section}>Actividades con cupos disponibles</Text>
      {cupos.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardTitle}>{item.actividad}</Text>
          <Text style={styles.text}>Cupo máximo: {item.cupo_maximo}</Text>
          <Text style={styles.text}>Inscriptos: {item.inscriptos}</Text>
          <Text style={styles.text}>Cupos libres: {item.cupos_libres}</Text>
        </View>
      ))}

      <Text style={styles.section}>Actividades más inscriptas</Text>
      {masInscriptos.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardTitle}>{item.actividad}</Text>
          <Text style={styles.text}>Disciplina: {item.disciplina}</Text>
          <Text style={styles.text}>Confirmados: {item.inscriptos_confirmados}</Text>
        </View>
      ))}

      <Text style={styles.section}>Inscriptos por disciplina</Text>
      {porDisciplina.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardTitle}>{item.disciplina}</Text>
          <Text style={styles.text}>Total inscriptos: {item.total_inscriptos}</Text>
        </View>
      ))}
    </ScrollView>
  );
}