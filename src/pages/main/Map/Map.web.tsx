import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Map() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mapas indisponíveis no Web</Text>
      <Text style={styles.text}>
        Esta funcionalidade usa módulos nativos (react-native-maps) que não estão disponíveis no ambiente web
        atual.
      </Text>
      <Text style={styles.text}>Abra no app mobile para visualizar o mapa.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    textAlign: "center",
    color: "#333",
  },
});
