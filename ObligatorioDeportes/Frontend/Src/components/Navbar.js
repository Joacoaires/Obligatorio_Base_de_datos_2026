import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";

const accesosPorRol = {
  administrador: [
    "Inicio",
    "Estudiantes",
    "Disciplinas",
    "Espacios",
    "Actividades",
    "Inscripciones",
    "Asistencias",
    "Reportes",
  ],
  estudiante: [
    "Inicio",
    "Actividades",
    "Inscripciones",
  ],
  profesor: [
    "Inicio",
    "Actividades",
    "Asistencias",
    "Reportes",
  ],
};

export default function Navbar({ pantalla, setPantalla, rol, setRol }) {
  const opciones = accesosPorRol[rol];

  return (
    <View style={styles.navbar}>
      <Text style={styles.logo}>Deportes UCU</Text>
      <Text style={styles.rol}>Rol: {rol}</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {opciones.map((opcion) => (
          <Pressable
            key={opcion}
            onPress={() => setPantalla(opcion)}
            style={[
              styles.boton,
              pantalla === opcion && styles.botonActivo,
            ]}
          >
            <Text
              style={[
                styles.texto,
                pantalla === opcion && styles.textoActivo,
              ]}
            >
              {opcion}
            </Text>
          </Pressable>
        ))}

        <Pressable
          onPress={() => {
            setRol(null);
            setPantalla("Inicio");
          }}
          style={styles.salir}
        >
          <Text style={styles.texto}>Salir</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: "#1f2937",
    paddingTop: 18,
    paddingBottom: 12,
    paddingHorizontal: 12,
  },
  logo: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  rol: {
    color: "#d1d5db",
    marginTop: 4,
    marginBottom: 12,
    textTransform: "capitalize",
  },
  boton: {
    backgroundColor: "#374151",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
  },
  botonActivo: {
    backgroundColor: "#2563eb",
  },
  salir: {
    backgroundColor: "#991b1b",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
  },
  texto: {
    color: "#e5e7eb",
    fontWeight: "600",
  },
  textoActivo: {
    color: "white",
  },
});