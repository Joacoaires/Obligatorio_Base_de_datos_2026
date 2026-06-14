import React, { useEffect, useState } from "react";
import { FlatList, Text, View, TextInput, Pressable, Alert } from "react-native";
import { API_URL } from "../config";
import { styles } from "../styles";

export default function AsistenciasScreen() {
  const [asistencias, setAsistencias] = useState([]);
  const [idEstudiante, setIdEstudiante] = useState("");
  const [idActividad, setIdActividad] = useState("");
  const [fecha, setFecha] = useState("");
  const [asistio, setAsistio] = useState(true);

  const cargarAsistencias = () => {
    fetch(`${API_URL}/asistencias/`)
      .then((res) => res.json())
      .then((data) => setAsistencias(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    cargarAsistencias();
  }, []);

  const registrarAsistencia = () => {
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

    fetch(`${API_URL}/asistencias/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_estudiante: estudianteNum,
        id_actividad: actividadNum,
        fecha: fecha.trim() || undefined,
        asistio: asistio,
      }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          Alert.alert("Error", data.error || "No se pudo registrar asistencia");
          return;
        }

        Alert.alert("Correcto", "Asistencia registrada");
        setIdEstudiante("");
        setIdActividad("");
        setFecha("");
        setAsistio(true);
        cargarAsistencias();
      })
      .catch((err) => {
        console.log(err);
        Alert.alert("Error", "No se pudo conectar con el servidor");
      });
  };

  const eliminarAsistencia = (id) => {
    fetch(`${API_URL}/asistencias/${id}`, {
      method: "DELETE",
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          Alert.alert("Error", data.error || "No se pudo eliminar la asistencia");
          return;
        }

        Alert.alert("Correcto", "Asistencia eliminada");
        cargarAsistencias();
      })
      .catch((err) => {
        console.log(err);
        Alert.alert("Error", "No se pudo conectar con el servidor");
      });
  };

  const encabezado = (
    <View>
      <Text style={styles.title}>Asistencias</Text>

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

        <Text style={styles.label}>Fecha</Text>
        <TextInput
          style={styles.input}
          value={fecha}
          onChangeText={setFecha}
          placeholder="YYYY-MM-DD"
        />

        <Pressable
          style={[
            styles.secondaryButton,
            asistio ? styles.presentButton : styles.absentButton,
          ]}
          onPress={() => setAsistio(!asistio)}
        >
          <Text style={styles.primaryButtonText}>
            {asistio ? "Asistió: Sí" : "Asistió: No"}
          </Text>
        </Pressable>

        <Pressable style={styles.primaryButton} onPress={registrarAsistencia}>
          <Text style={styles.primaryButtonText}>Registrar asistencia</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={asistencias}
        ListHeaderComponent={encabezado}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyExtractor={(item, index) =>
          item.id_asistencia ? item.id_asistencia.toString() : index.toString()
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.estudiante}</Text>
            <Text style={styles.text}>ID Asistencia: {item.id_asistencia}</Text>
            <Text style={styles.text}>ID Estudiante: {item.id_estudiante}</Text>
            <Text style={styles.text}>ID Actividad: {item.id_actividad}</Text>
            <Text style={styles.text}>Actividad: {item.actividad}</Text>
            <Text style={styles.text}>Fecha: {item.fecha}</Text>
            <Text style={styles.text}>
              Asistió: {item.asistio === 1 || item.asistio === true ? "Sí" : "No"}
            </Text>

            <Pressable
              style={styles.dangerButton}
              onPress={() => eliminarAsistencia(item.id_asistencia)}
            >
              <Text style={styles.primaryButtonText}>Eliminar asistencia</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}