import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { firestore as db } from "../firebase/firebaseConfig";

export default function RequestDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState<any>(null);

  async function fetchRequest() {
    try {
      const ref = doc(db, "helps", String(id));
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        return;
      }

      setRequest({ id: snap.id, ...snap.data() });
    } catch (error) {
      console.log("Erro ao buscar pedido:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRequest();
  }, [id]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!request) {
    return (
      <View style={{ padding: 24 }}>
        <Text>Pedido não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={{ color: "#2563EB", marginBottom: 16 }}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 26, fontWeight: "bold", marginBottom: 8 }}>
        {request.title}
      </Text>

      <Text style={{ color: "#64748B", marginBottom: 16 }}>
        Status: {request.status}
      </Text>

      <Text style={{ fontSize: 16 }}>{request.description}</Text>
    </View>
  );
}
