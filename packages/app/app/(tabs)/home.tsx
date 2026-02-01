import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";
import { auth } from "../../firebase/firebaseConfig";
import { firestore as db } from "../../firebase/firebaseConfig";

export default function Home() {
  const user = auth.currentUser;

  const [loading, setLoading] = useState(true);
  const [helps, setHelps] = useState<any[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  async function fetchHelps() {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "helps"));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHelps(data);
    } catch (e) {
      console.log("Erro ao buscar:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHelps();
  }, []);

  async function handleSave() {
    if (!title || !description) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        // ✏️ EDITAR
        await updateDoc(doc(db, "helps", editingId), {
          title,
          description
        });
        Alert.alert("Sucesso", "Pedido atualizado!");
      } else {
        // ➕ CRIAR
        await addDoc(collection(db, "helps"), {
          title,
          description,
          status: "open",
          createdAt: serverTimestamp(),
          userId: user?.uid
        });
        Alert.alert("Sucesso", "Pedido criado!");
      }

      setModalVisible(false);
      setEditingId(null);
      setTitle("");
      setDescription("");
      fetchHelps();
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(item: any) {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description);
    setModalVisible(true);
  }

  async function handleDelete(id: string) {
    Alert.alert(
      "Excluir pedido",
      "Tem certeza?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            await deleteDoc(doc(db, "helps", id));
            fetchHelps();
          }
        }
      ]
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <View style={{ padding: 20, paddingTop: 60, backgroundColor: "white" }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>
          Ajudas Castanhal
        </Text>
      </View>

      <FlatList
        data={helps}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchHelps} />
        }
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 40 }}>
            Nenhum pedido ainda
          </Text>
        }
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "white",
              padding: 16,
              borderRadius: 12,
              marginBottom: 12
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {item.title}
            </Text>
            <Text style={{ marginTop: 4 }}>{item.description}</Text>

            {item.userId === user?.uid && (
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 12,
                  gap: 16
                }}
              >
                <TouchableOpacity onPress={() => handleEdit(item)}>
                  <Ionicons name="create-outline" size={22} color="#2563EB" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Ionicons name="trash-outline" size={22} color="#EF4444" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />

      <TouchableOpacity
        onPress={() => {
          setEditingId(null);
          setTitle("");
          setDescription("");
          setModalVisible(true);
        }}
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: "#2563EB",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.5)"
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 24,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}>
              {editingId ? "Editar Pedido" : "Novo Pedido"}
            </Text>

            <TextInput
              placeholder="Título"
              value={title}
              onChangeText={setTitle}
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                padding: 12,
                borderRadius: 8,
                marginBottom: 12
              }}
            />

            <TextInput
              placeholder="Descrição"
              value={description}
              onChangeText={setDescription}
              multiline
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                padding: 12,
                borderRadius: 8,
                marginBottom: 16
              }}
            />

            <TouchableOpacity
              onPress={handleSave}
              style={{
                backgroundColor: "#2563EB",
                padding: 14,
                borderRadius: 12,
                alignItems: "center"
              }}
            >
              {saving ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Salvar
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
