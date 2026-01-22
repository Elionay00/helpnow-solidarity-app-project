import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function MapScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="map-outline" size={80} color="#CBD5E1" />
      <Text style={styles.title}>Mapa Disponível no App</Text>
      <Text style={styles.text}>
        A visualização do mapa nativo requer Android ou iOS.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#334155", marginTop: 20 },
  text: { fontSize: 16, color: "#64748B", marginTop: 10 },
});