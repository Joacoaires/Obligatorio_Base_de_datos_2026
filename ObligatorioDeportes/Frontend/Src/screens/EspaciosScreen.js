import React, { useEffect, useState } from "react";
import { FlatList, Text, View, TextInput, Pressable, Alert } from "react-native";
import { API_URL } from "../config";
import { styles } from "../styles";

export default function EspaciosScreen() {
  const [espacios, setEspacios] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [nombre, setNombre] = useState("");
  const [ubicacion, setUbicacion] = useState("");

  const cargarEspacios = () => {
    fetch(`${API_URL}/espacios/`)
      .then((res) => res.json())
      .then((data) => setEspacios(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    cargarEspacios();
  }, []);

  const crearEspacio = () => {
    if (!nombre.trim()) {
      Alert.alert("Error", "Debe ingresar el nombre del espacio");
      return;
    }

    fetch(`${API_URL}/espacios/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre,
        ubicacion,
      }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          Alert.alert("Error", data.error || "No se pudo crear el espacio");
          return;
        }

        Alert.alert("Correcto", "Espacio creado");
        setNombre("");
        setUbicacion("");
        setMostrarFormulario(false);
        cargarEspacios();
      })
      .catch((err) => {
        console.log(err);
        Alert.alert("Error", "No se pudo conectar con el servidor");
      });
  };

  const encabezado = (
    <View>
      <Text style={styles.title}>Espacios deportivos</Text>

      <Pressable
        style={styles.primaryButton}
        onPress={() => setMostrarFormulario(!mostrarFormulario)}
      >
        <Text style={styles.primaryButtonText}>
          {mostrarFormulario ? "Volver" : "+ Crear espacio"}
        </Text>
      </Pressable>

      {mostrarFormulario && (
        <View style={styles.form}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ej: Gimnasio principal"
          />

          <Text style={styles.label}>Ubicación</Text>
          <TextInput
            style={styles.input}
            value={ubicacion}
            onChangeText={setUbicacion}
            placeholder="Ej: Sede central"
          />

          <Pressable style={styles.primaryButton} onPress={crearEspacio}>
            <Text style={styles.primaryButtonText}>Guardar espacio</Text>
          </Pressable>
        </View>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={espacios}
        ListHeaderComponent={encabezado}
        keyExtractor={(item) => item.id_espacio.toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.nombre}</Text>
            <Text style={styles.text}>ID Espacio: {item.id_espacio}</Text>
            <Text style={styles.text}>Ubicación: {item.ubicacion}</Text>
          </View>
        )}
      />
    </View>
  );
}