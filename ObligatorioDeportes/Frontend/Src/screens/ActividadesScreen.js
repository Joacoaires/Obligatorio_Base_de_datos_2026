import React, { useEffect, useState } from "react";
import { FlatList, Text, View, TextInput, Pressable, Alert } from "react-native";
import { API_URL } from "../config";
import { styles } from "../styles";

export default function ActividadesScreen() {
  const [actividades, setActividades] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [nombre, setNombre] = useState("");
  const [idDisciplina, setIdDisciplina] = useState("");
  const [idEspacio, setIdEspacio] = useState("");
  const [cupo, setCupo] = useState("");
  const [dia, setDia] = useState("");
  const [hora, setHora] = useState("");

  const cargarActividades = () => {
    fetch(`${API_URL}/actividades/`)
      .then((res) => res.json())
      .then((data) => setActividades(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    cargarActividades();
  }, []);

  const crearActividad = () => {
    if (
      !nombre.trim() ||
      !idDisciplina.trim() ||
      !idEspacio.trim() ||
      !cupo.trim() ||
      !dia.trim() ||
      !hora.trim()
    ) {
      Alert.alert("Error", "Debe completar todos los campos");
      return;
    }

    const disciplinaNum = Number(idDisciplina);
    const espacioNum = Number(idEspacio);
    const cupoNum = Number(cupo);

    if (
      isNaN(disciplinaNum) ||
      disciplinaNum <= 0 ||
      isNaN(espacioNum) ||
      espacioNum <= 0 ||
      isNaN(cupoNum) ||
      cupoNum <= 0
    ) {
      Alert.alert("Error", "Los IDs y el cupo deben ser números mayores a 0");
      return;
    }

    fetch(`${API_URL}/actividades/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        id_disciplina: disciplinaNum,
        id_espacio: espacioNum,
        cupo_maximo: cupoNum,
        dia,
        hora,
        estado: "ABIERTA",
      }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          Alert.alert("Error", data.error || "No se pudo crear la actividad");
          return;
        }

        Alert.alert("Correcto", "Actividad creada");
        setNombre("");
        setIdDisciplina("");
        setIdEspacio("");
        setCupo("");
        setDia("");
        setHora("");
        setMostrarFormulario(false);
        cargarActividades();
      })
      .catch(() => Alert.alert("Error", "No se pudo conectar con el servidor"));
  };

  const eliminarActividad = (id) => {
    fetch(`${API_URL}/actividades/${id}`, { method: "DELETE" })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          Alert.alert("Error", data.error || "No se pudo eliminar la actividad");
          return;
        }

        Alert.alert("Correcto", "Actividad eliminada");
        cargarActividades();
      })
      .catch(() => Alert.alert("Error", "No se pudo conectar con el servidor"));
  };

  const encabezado = (
    <View>
      <Text style={styles.title}>Actividades</Text>

      <Pressable
        style={styles.primaryButton}
        onPress={() => setMostrarFormulario(!mostrarFormulario)}
      >
        <Text style={styles.primaryButtonText}>
          {mostrarFormulario ? "Volver" : "+ Crear actividad"}
        </Text>
      </Pressable>

      {mostrarFormulario && (
        <View style={styles.form}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ej: Fútbol recreativo"
          />

          <Text style={styles.label}>ID Disciplina</Text>
          <TextInput
            style={styles.input}
            value={idDisciplina}
            onChangeText={setIdDisciplina}
            keyboardType="numeric"
            placeholder="Ej: 1"
          />

          <Text style={styles.label}>ID Espacio</Text>
          <TextInput
            style={styles.input}
            value={idEspacio}
            onChangeText={setIdEspacio}
            keyboardType="numeric"
            placeholder="Ej: 1"
          />

          <Text style={styles.label}>Cupo máximo</Text>
          <TextInput
            style={styles.input}
            value={cupo}
            onChangeText={setCupo}
            keyboardType="numeric"
            placeholder="Ej: 20"
          />

          <Text style={styles.label}>Día</Text>
          <TextInput
            style={styles.input}
            value={dia}
            onChangeText={setDia}
            placeholder="Ej: Lunes"
          />

          <Text style={styles.label}>Hora</Text>
          <TextInput
            style={styles.input}
            value={hora}
            onChangeText={setHora}
            placeholder="Ej: 18:00:00"
          />

          <Pressable style={styles.primaryButton} onPress={crearActividad}>
            <Text style={styles.primaryButtonText}>Guardar actividad</Text>
          </Pressable>
        </View>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={actividades}
        ListHeaderComponent={encabezado}
        keyExtractor={(item) => item.id_actividad.toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.nombre}</Text>
            <Text style={styles.text}>ID Actividad: {item.id_actividad}</Text>
            <Text style={styles.text}>Disciplina: {item.disciplina}</Text>
            <Text style={styles.text}>Espacio: {item.espacio}</Text>
            <Text style={styles.text}>Día: {item.dia}</Text>
            <Text style={styles.text}>Horario: {item.hora || item.horario}</Text>
            <Text style={styles.text}>Cupo máximo: {item.cupo_maximo}</Text>
            <Text style={styles.text}>Estado: {item.estado}</Text>

            <Pressable
              style={styles.dangerButton}
              onPress={() => eliminarActividad(item.id_actividad)}
            >
              <Text style={styles.primaryButtonText}>Eliminar actividad</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}