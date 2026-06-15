import React, { useEffect, useState } from "react";
import { FlatList, Text, View, TextInput, Pressable, Alert } from "react-native";
import { API_URL } from "../config";
import { styles } from "../styles";

export default function DisciplinasScreen() {
  const [disciplinas, setDisciplinas] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nombre, setNombre] = useState("");

  const cargarDisciplinas = () => {
    fetch(`${API_URL}/disciplinas/`)
      .then((res) => res.json())
      .then(setDisciplinas)
      .catch(console.log);
  };

  useEffect(() => {
    cargarDisciplinas();
  }, []);

  const crearDisciplina = () => {
    if (!nombre.trim()) {
      Alert.alert("Error", "Debe ingresar un nombre");
      return;
    }

    fetch(`${API_URL}/disciplinas/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          Alert.alert("Error", data.error || "No se pudo crear");
          return;
        }

        Alert.alert("Correcto", "Disciplina creada");
        setNombre("");
        setMostrarForm(false);
        cargarDisciplinas();
      })
      .catch(() => Alert.alert("Error", "No se pudo conectar"));
  };

  const eliminarDisciplina = (id) => {
    fetch(`${API_URL}/disciplinas/${id}`, { method: "DELETE" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          Alert.alert("Error", data.error || "No se pudo eliminar");
          return;
        }

        Alert.alert("Correcto", "Disciplina eliminada");
        cargarDisciplinas();
      })
      .catch(() => Alert.alert("Error", "No se pudo conectar"));
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>Disciplinas deportivas</Text>

      <Pressable style={styles.primaryButton} onPress={() => setMostrarForm(!mostrarForm)}>
        <Text style={styles.primaryButtonText}>
          {mostrarForm ? "Cerrar formulario" : "+ Crear disciplina"}
        </Text>
      </Pressable>

      {mostrarForm && (
        <View style={styles.form}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ej: Fútbol"
          />

          <Pressable style={styles.primaryButton} onPress={crearDisciplina}>
            <Text style={styles.primaryButtonText}>Guardar disciplina</Text>
          </Pressable>
        </View>
      )}

      <FlatList
        data={disciplinas}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyExtractor={(item) => item.id_disciplina.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.nombre}</Text>
            <Text style={styles.text}>ID Disciplina: {item.id_disciplina}</Text>

            <Pressable
              style={styles.dangerButton}
              onPress={() => eliminarDisciplina(item.id_disciplina)}
            >
              <Text style={styles.primaryButtonText}>Eliminar disciplina</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}