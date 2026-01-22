import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Input } from "../../components/Input";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig"; 

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)/home");
    } catch (error: any) {
      console.log(error);
      Alert.alert("Erro ao entrar", "Verifique seu e-mail e senha.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24, backgroundColor: "white" }}>
      <View className="items-center mb-8">
        <Text className="text-3xl font-bold text-gray-900">HelpNow 3.0 🚀</Text>
        <Text className="text-gray-500 mt-2">Solidariedade em ação</Text>
      </View>

      <View className="w-full">
        <Input
          label="E-mail"
          placeholder="seu@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Input
          label="Senha"
          placeholder="********"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true} // ✅ CERTO: Boolean (azul), sem aspas
        />

        <TouchableOpacity
          className={`w-full bg-blue-600 p-4 rounded-xl mt-4 items-center ${isLoading ? "opacity-70" : ""}`}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text className="text-white font-bold text-lg">
            {isLoading ? "Entrando..." : "Entrar"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="mt-6 items-center"
          onPress={() => router.push("/(auth)/register")}
        >
          <Text className="text-gray-600">
            Não tem conta? <Text className="text-blue-600 font-bold">Cadastre-se</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}