import React, { useEffect, useState } from "react";
import { FlatList, Text, View, TextInput, Pressable, Alert } from "react-native";
import { API_URL } from "../config";
import { styles } from "../styles";

export default function InscripcionesScreen() {
  const [inscripciones, setInscripciones] = useState([]);
  const [idEstudiante, setIdEstudiante] = useState("");
  const [idActividad, setIdActividad] = useState("");

  const cargarInscripciones = () => {
    fetch(`${API_URL}/inscripciones/`)
      .then((res) => res.json())
      .then((data) => setInscripciones(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    cargarInscripciones();
  }, []);

  const inscribir = () => {
    if (!idEstudiante || !idActividad) {
      Alert.alert("Error", "Debe ingresar estudiante y actividad");
      return;
    }

    fetch(`${API_URL}/inscripciones/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_estudiante: Number(idEstudiante),
        id_actividad: Number(idActividad),
      }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          Alert.alert("Error", data.error || "No se pudo inscribir");
          return;
        }

        Alert.alert("Inscripción realizada", `Estado: ${data.estado}`);
        setIdEstudiante("");
        setIdActividad("");
        cargarInscripciones();
      })
      .catch((err) => console.log(err));
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>Inscripciones</Text>

      <View style={styles.form}>
        <Text style={styles.label}>ID Estudiante</Text>
        <TextInput
          style={styles.input}
          value={idEstudiante}
          onChangeText={setIdEstudiante}
          keyboardType="numeric"
          placeholder="Ej: 1"
        />

        <Text style={styles.label}>ID Actividad</Text>
        <TextInput
          style={styles.input}
          value={idActividad}
          onChangeText={setIdActividad}
          keyboardType="numeric"
          placeholder="Ej: 1"
        />

        <Pressable style={styles.primaryButton} onPress={inscribir}>
          <Text style={styles.primaryButtonText}>Inscribir estudiante</Text>
        </Pressable>
      </View>

      <FlatList
        data={inscripciones}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyExtractor={(item) => item.id_inscripcion.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.estudiante}</Text>
            <Text style={styles.text}>Actividad: {item.actividad}</Text>
            <Text style={styles.text}>Estado: {item.estado}</Text>
            <Text style={styles.text}>Fecha: {item.fecha_inscripcion}</Text>
          </View>
        )}
      />
    </View>
  );
}