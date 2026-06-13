import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { API_URL } from "../config";
import { styles } from "../styles";

export default function DisciplinasScreen() {
  const [disciplinas, setDisciplinas] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/disciplinas`)
      .then((res) => res.json())
      .then((data) => setDisciplinas(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>Disciplinas deportivas</Text>

      <FlatList
        data={disciplinas}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyExtractor={(item) => item.id_disciplina.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {item.nombre}
            </Text>

            <Text style={styles.text}>
              {item.descripcion}
            </Text>
          </View>
        )}
      />
    </View>
  );
}