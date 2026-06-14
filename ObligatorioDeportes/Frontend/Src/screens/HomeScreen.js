import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Sistema de Gestión de Actividades Deportivas
      </Text>

      <Text style={styles.text}>
        Desde este panel se pueden consultar estudiantes, disciplinas,
        espacios, actividades, inscripciones, asistencias y reportes.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: "#374151",
  },
});