import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore as db, auth } from "../../firebase/firebaseConfig";

export default function NeedHelp() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!title || !description) {
      return Alert.alert("Ops", "Preencha todos os campos");
    }

    if (!auth.currentUser) {
      return Alert.alert("Erro", "Usuário não autenticado");
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "helps"), {
        title,
        description,
        status: "open",
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Sucesso", "Pedido criado com sucesso!");
      router.replace("/(tabs)/home");
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível criar o pedido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        Preciso de Ajuda
      </Text>

      <TextInput
        placeholder="Título (ex: Cesta básica)"
        value={title}
        onChangeText={setTitle}
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          padding: 14,
          borderRadius: 10,
          marginBottom: 12,
        }}
      />

      <TextInput
        placeholder="Descreva sua necessidade..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          padding: 14,
          borderRadius: 10,
          marginBottom: 20,
          textAlignVertical: "top",
        }}
      />

      <TouchableOpacity
        onPress={handleCreate}
        disabled={loading}
        style={{
          backgroundColor: "#2563EB",
          padding: 16,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Criar Pedido
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
