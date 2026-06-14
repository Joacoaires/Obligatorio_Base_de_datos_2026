import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { API_URL } from "../config";
import { styles } from "../styles";

export default function ActividadesScreen() {
  const [actividades, setActividades] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/actividades`)
      .then((res) => res.json())
      .then((data) => setActividades(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.title}>Actividades</Text>

      <FlatList
        data={actividades}
        keyExtractor={(item) => item.id_actividad.toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.nombre}</Text>

            <Text style={styles.text}>
              ID Actividad: {item.id_actividad}
            </Text>

            <Text style={styles.text}>
              Disciplina: {item.disciplina}
            </Text>

            <Text style={styles.text}>
              Espacio: {item.espacio}
            </Text>

            <Text style={styles.text}>
              Día: {item.dia}
            </Text>

            <Text style={styles.text}>
              Horario: {item.horario}
            </Text>

            <Text style={styles.text}>
              Cupo máximo: {item.cupo_maximo}
            </Text>

            <Text style={styles.text}>
              Estado: {item.estado}
            </Text>
          </View>
        )}
      />
    </View>
  );
}