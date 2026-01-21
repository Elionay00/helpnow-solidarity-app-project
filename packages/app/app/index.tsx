import { View, Text } from "react-native";
import { Button } from "../components/Button"; // Verifique se o import do Button está certo
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-white p-5">
      <Text className="text-2xl font-bold mb-5 text-gray-800">HelpNow 3.0 🚀</Text>
      
      {/* CORREÇÃO: Remova o /(auth) dos links */}
      <Button 
        title="Entrar (Login)" 
        onPress={() => router.push("/login")} 
      />
      
      <Button 
        title="Criar Conta" 
        variant="outline" 
        onPress={() => router.push("/register")} 
      />
    </View>
  );
}