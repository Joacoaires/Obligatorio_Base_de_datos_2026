import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { API_URL } from "../config";
import { styles } from "../styles";

export default function EspaciosScreen() {
  const [espacios, setEspacios] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/espacios/`)
      .then((res) => res.json())
      .then((data) => setEspacios(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>Espacios deportivos</Text>

      <FlatList
        data={espacios}
        keyExtractor={(item) => item.id_espacio.toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.nombre}</Text>
            <Text style={styles.text}>Ubicación: {item.ubicacion}</Text>
            <Text style={styles.text}>Capacidad: {item.capacidad}</Text>
          </View>
        )}
      />
    </View>
  );
}