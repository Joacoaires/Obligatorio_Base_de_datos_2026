import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { API_URL } from "../config";
import { styles } from "../styles";

export default function EstudiantesScreen() {
  const [estudiantes, setEstudiantes] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/estudiantes`)
      .then((res) => res.json())
      .then((data) => setEstudiantes(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>Estudiantes</Text>

      <FlatList
        data={estudiantes}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyExtractor={(item) => item.id_estudiante.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {item.nombre} {item.apellido}
            </Text>
            <Text style={styles.text}>Documento: {item.documento}</Text>
            <Text style={styles.text}>ID Estudiante: {item.id_estudiante}</Text>
            <Text style={styles.text}>Correo: {item.correo}</Text>
            <Text style={styles.text}>Carrera: {item.carrera}</Text>
            <Text style={styles.text}>Facultad: {item.facultad}</Text>
          </View>
        )}
      />
    </View>
  );
}