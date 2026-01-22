import { Stack } from "expo-router";
import "../global.css"; // Mantendo a importação do estilo

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Rotas Principais */}
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      
      {/* Rota Inicial (Splash/Index) */}
      <Stack.Screen name="index" />
    </Stack>
  );
}