import { View, Text, FlatList } from "react-native";
import { useState } from "react";

export default function HomeScreen() {
  const dadosFake = [
    { id: "1", titulo: "Doação de roupas" },
    { id: "2", titulo: "Ajuda com alimentos" },
    { id: "3", titulo: "Transporte solidário" },
  ];

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        Ajudas Castanhal
      </Text>

      <FlatList
        data={dadosFake}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              marginVertical: 8,
              backgroundColor: "#eee",
              borderRadius: 8,
            }}
          >
            <Text>{item.titulo}</Text>
          </View>
        )}
      />
    </View>
  );
}
