import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import Navbar from "./Src/components/Navbar";
import BienvenidaScreen from "./Src/screens/BienvenidaScreen";
import HomeScreen from "./Src/screens/HomeScreen";
import EstudiantesScreen from "./Src/screens/EstudiantesScreen";
import DisciplinasScreen from "./Src/screens/DisciplinasScreen";
import EspaciosScreen from "./Src/screens/EspaciosScreen";
import ActividadesScreen from "./Src/screens/ActividadesScreen";
import InscripcionesScreen from "./Src/screens/InscripcionesScreen";
import AsistenciasScreen from "./Src/screens/AsistenciasScreen";
import ReportesScreen from "./Src/screens/ReportesScreen";

export default function App() {
  const [rol, setRol] = useState(null);
  const [pantalla, setPantalla] = useState("Inicio");

  if (!rol) {
    return <BienvenidaScreen setRol={setRol} />;
  }

  function mostrarPantalla() {
    if (pantalla === "Inicio") return <HomeScreen rol={rol} />;
    if (pantalla === "Estudiantes") return <EstudiantesScreen />;
    if (pantalla === "Disciplinas") return <DisciplinasScreen />;
    if (pantalla === "Espacios") return <EspaciosScreen />;
    if (pantalla === "Actividades") return <ActividadesScreen />;
    if (pantalla === "Inscripciones") return <InscripcionesScreen />;
    if (pantalla === "Asistencias") return <AsistenciasScreen />;
    if (pantalla === "Reportes") return <ReportesScreen />;
  }

  return (
    <View style={styles.container}>
      <Navbar
        pantalla={pantalla}
        setPantalla={setPantalla}
        rol={rol}
        setRol={setRol}
      />

      <View style={styles.content}>
        {mostrarPantalla()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  content: {
    flex: 1,
    padding: 16,
  },
});