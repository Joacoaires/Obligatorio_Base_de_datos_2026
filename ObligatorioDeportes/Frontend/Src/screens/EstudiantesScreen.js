import React, { useEffect, useState } from "react";
import { FlatList, Text, View, TextInput, Pressable, Alert } from "react-native";
import { API_URL } from "../config";
import { styles } from "../styles";

export default function EstudiantesScreen() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [documento, setDocumento] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [carrera, setCarrera] = useState("");
  const [facultad, setFacultad] = useState("");

  const cargarEstudiantes = () => {
    fetch(`${API_URL}/estudiantes/`)
      .then((res) => res.json())
      .then((data) => setEstudiantes(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  const crearEstudiante = () => {
    if (
      !documento.trim() ||
      !nombre.trim() ||
      !apellido.trim() ||
      !correo.trim() ||
      !carrera.trim() ||
      !facultad.trim()
    ) {
      Alert.alert("Error", "Debe completar todos los campos");
      return;
    }

    fetch(`${API_URL}/estudiantes/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        documento,
        nombre,
        apellido,
        correo,
        carrera,
        facultad,
      }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          Alert.alert("Error", data.error || "No se pudo crear el estudiante");
          return;
        }

        Alert.alert("Correcto", "Estudiante creado");
        setDocumento("");
        setNombre("");
        setApellido("");
        setCorreo("");
        setCarrera("");
        setFacultad("");
        setMostrarFormulario(false);
        cargarEstudiantes();
      })
      .catch(() => Alert.alert("Error", "No se pudo conectar con el servidor"));
  };

  const eliminarEstudiante = (id) => {
    fetch(`${API_URL}/estudiantes/${id}`, { method: "DELETE" })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          Alert.alert("Error", data.error || "No se pudo eliminar el estudiante");
          return;
        }

        Alert.alert("Correcto", "Estudiante eliminado");
        cargarEstudiantes();
      })
      .catch(() => Alert.alert("Error", "No se pudo conectar con el servidor"));
  };

  const encabezado = (
    <View>
      <Text style={styles.title}>Estudiantes</Text>

      <Pressable
        style={styles.primaryButton}
        onPress={() => setMostrarFormulario(!mostrarFormulario)}
      >
        <Text style={styles.primaryButtonText}>
          {mostrarFormulario ? "Volver" : "+ Crear estudiante"}
        </Text>
      </Pressable>

      {mostrarFormulario && (
        <View style={styles.form}>
          <Text style={styles.label}>Documento</Text>
          <TextInput
            style={styles.input}
            value={documento}
            onChangeText={setDocumento}
            placeholder="Ej: 12345678"
          />

          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ej: Ana"
          />

          <Text style={styles.label}>Apellido</Text>
          <TextInput
            style={styles.input}
            value={apellido}
            onChangeText={setApellido}
            placeholder="Ej: García"
          />

          <Text style={styles.label}>Correo</Text>
          <TextInput
            style={styles.input}
            value={correo}
            onChangeText={setCorreo}
            placeholder="Ej: ana@email.com"
          />

          <Text style={styles.label}>Carrera</Text>
          <TextInput
            style={styles.input}
            value={carrera}
            onChangeText={setCarrera}
            placeholder="Ej: Abogacía"
          />

          <Text style={styles.label}>Facultad</Text>
          <TextInput
            style={styles.input}
            value={facultad}
            onChangeText={setFacultad}
            placeholder="Ej: Derecho"
          />

          <Pressable style={styles.primaryButton} onPress={crearEstudiante}>
            <Text style={styles.primaryButtonText}>Guardar estudiante</Text>
          </Pressable>
        </View>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={estudiantes}
        ListHeaderComponent={encabezado}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyExtractor={(item) => item.id_estudiante.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {item.nombre} {item.apellido}
            </Text>

            <Text style={styles.text}>ID Estudiante: {item.id_estudiante}</Text>
            <Text style={styles.text}>Documento: {item.documento}</Text>
            <Text style={styles.text}>Correo: {item.correo}</Text>
            <Text style={styles.text}>Carrera: {item.carrera}</Text>
            <Text style={styles.text}>Facultad: {item.facultad}</Text>

            <Pressable
              style={styles.dangerButton}
              onPress={() => eliminarEstudiante(item.id_estudiante)}
            >
              <Text style={styles.primaryButtonText}>Eliminar estudiante</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}