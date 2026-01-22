import { View, Text, ActivityIndicator, Alert, ScrollView, Image } from "react-native";
import { useState, useEffect } from "react";
import { auth, firestore } from "../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import { Button } from "../../components/Button";
import { Ionicons } from "@expo/vector-icons";

interface UserData {
  fullName: string;
  email: string;
  phone: string;
  cpf: string;
  role: string;
}

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Buscar dados do usuário ao carregar a tela
  useEffect(() => {
    fetchUserData();
  }, []);

  async function fetchUserData() {
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        // Se não tiver usuário logado, volta pro login
        router.replace("/login");
        return;
      }

      // Busca o documento no Firestore pelo ID do usuário
      const userDoc = await getDoc(doc(firestore, "users", currentUser.uid));

      if (userDoc.exists()) {
        setUser(userDoc.data() as UserData);
      } else {
        Alert.alert("Erro", "Perfil não encontrado.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao carregar perfil.");
    } finally {
      setLoading(false);
    }
  }

  // 2. Função de Sair (Logout)
  async function handleLogout() {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível sair.");
    }
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Cabeçalho Azul */}
      <View className="bg-blue-600 pb-10 pt-12 rounded-b-3xl items-center shadow-lg">
        <View className="bg-white p-1 rounded-full mb-3">
          <View className="w-24 h-24 bg-gray-200 rounded-full items-center justify-center overflow-hidden">
             {/* Avatar Genérico */}
            <Ionicons name="person" size={50} color="#9CA3AF" />
          </View>
        </View>
        <Text className="text-white text-2xl font-bold">
          {user?.fullName || "Usuário"}
        </Text>
        <Text className="text-blue-100">{user?.role === 'admin' ? 'Administrador' : 'Voluntário / Usuário'}</Text>
      </View>

      {/* Cartão de Informações */}
      <View className="mx-5 -mt-8 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <InfoRow icon="mail" label="E-mail" value={user?.email} />
        <InfoRow icon="call" label="Telefone" value={user?.phone} />
        <InfoRow icon="card" label="CPF" value={user?.cpf} />
      </View>

      {/* Ações */}
      <View className="p-5 mt-4">
        <Button 
          title="Editar Perfil" 
          variant="outline" 
          onPress={() => Alert.alert("Em breve", "Edição de perfil será implementada na próxima fase!")} 
        />
        
        <View className="mt-4">
          <Button 
            title="Sair do App" 
            onPress={handleLogout} 
            variant="outline"
          />
        </View>
      </View>

      <Text className="text-center text-gray-400 text-xs mt-10 mb-5">
        Versão 2.0.0 (Alpha)
      </Text>
    </ScrollView>
  );
}

// Componente auxiliar para as linhas de informação
function InfoRow({ icon, label, value }: { icon: any, label: string, value?: string }) {
  return (
    <View className="flex-row items-center py-3 border-b border-gray-100 last:border-0">
      <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-4">
        <Ionicons name={icon} size={20} color="#2563EB" />
      </View>
      <View>
        <Text className="text-gray-400 text-xs uppercase">{label}</Text>
        <Text className="text-gray-800 font-medium text-base">{value || "Não informado"}</Text>
      </View>
    </View>
  );
}