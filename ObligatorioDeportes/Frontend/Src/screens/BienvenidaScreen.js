import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function BienvenidaScreen({ setRol }) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logo}>⚽️</Text>
        <Text style={styles.title}>
          Sistema de Gestión de Actividades Deportivas
        </Text>

        <Text style={styles.subtitle}>
          Universidad Católica del Uruguay
        </Text>

        <Text style={styles.description}>
          Seleccione el perfil con el que desea acceder al sistema.
        </Text>

        <Pressable
          style={[styles.button, styles.admin]}
          onPress={() => setRol("administrador")}
        >
          <Text style={styles.buttonText}>Administrador</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.student]}
          onPress={() => setRol("estudiante")}
        >
          <Text style={styles.buttonText}>Estudiante</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.teacher]}
          onPress={() => setRol("profesor")}
        >
          <Text style={styles.buttonText}>Profesor</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  logo: {
    fontSize: 50,
    textAlign: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#111827",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 10,
  },

  description: {
    textAlign: "center",
    color: "#4b5563",
    marginBottom: 25,
  },

  button: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },

  admin: {
    backgroundColor: "#2563eb",
  },

  student: {
    backgroundColor: "#059669",
  },

  teacher: {
    backgroundColor: "#ea580c",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});