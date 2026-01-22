import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      {/* Se tiver registro futuramente: <Stack.Screen name="register" /> */}
    </Stack>
  );
}