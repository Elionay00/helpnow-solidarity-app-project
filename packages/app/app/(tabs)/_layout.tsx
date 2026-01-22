import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false, 
      tabBarActiveTintColor: "#2563EB",
      tabBarStyle: { paddingBottom: 5, paddingTop: 5, height: 60 }
    }}>
      {/* Aba Início */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />

      {/* Aba Mapa */}
      <Tabs.Screen
        name="map"
        options={{
          title: "Mapa",
          tabBarIcon: ({ color }) => <Ionicons name="map" size={24} color={color} />,
        }}
      />

      {/* Aba Perfil */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />

      {/* Rota Oculta (Index) - Não aparece na barra */}
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
}