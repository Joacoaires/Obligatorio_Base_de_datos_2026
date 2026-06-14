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
    const estudianteNum = Number(idEstudiante);
    const actividadNum = Number(idActividad);

    if (!idEstudiante.trim() || !idActividad.trim()) {
      Alert.alert("Error", "Debe ingresar ID de estudiante e ID de actividad");
      return;
    }

    if (isNaN(estudianteNum) || estudianteNum <= 0) {
      Alert.alert("Error", "El ID del estudiante debe ser un número mayor a 0");
      return;
    }

    if (isNaN(actividadNum) || actividadNum <= 0) {
      Alert.alert("Error", "El ID de la actividad debe ser un número mayor a 0");
      return;
    }

    fetch(`${API_URL}/inscripciones/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_estudiante: estudianteNum,
        id_actividad: actividadNum,
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
      .catch((err) => {
        console.log(err);
        Alert.alert("Error", "No se pudo conectar con el servidor");
      });
  };

  const cancelarInscripcion = (id) => {
    fetch(`${API_URL}/inscripciones/${id}`, {
      method: "DELETE",
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          Alert.alert("Error", data.error || "No se pudo cancelar la inscripción");
          return;
        }

        Alert.alert("Correcto", "Inscripción cancelada");
        cargarInscripciones();
      })
      .catch((err) => {
        console.log(err);
        Alert.alert("Error", "No se pudo conectar con el servidor");
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>Inscripciones</Text>

      <View style={styles.form}>
        <Text style={styles.label}>ID Estudiante</Text>
        <TextInput style={styles.input} value={idEstudiante} onChangeText={setIdEstudiante} keyboardType="numeric" placeholder="Ej: 1" />

        <Text style={styles.label}>ID Actividad</Text>
        <TextInput style={styles.input} value={idActividad} onChangeText={setIdActividad} keyboardType="numeric" placeholder="Ej: 1" />

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
            <Text style={styles.text}>ID Inscripción: {item.id_inscripcion}</Text>
            <Text style={styles.text}>ID Estudiante: {item.id_estudiante}</Text>
            <Text style={styles.text}>ID Actividad: {item.id_actividad}</Text>
            <Text style={styles.text}>Actividad: {item.actividad}</Text>
            <Text style={styles.text}>Estado: {item.estado}</Text>
            <Text style={styles.text}>Fecha: {item.fecha_inscripcion}</Text>

            <Pressable style={styles.dangerButton} onPress={() => cancelarInscripcion(item.id_inscripcion)}>
              <Text style={styles.primaryButtonText}>Cancelar inscripción</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}