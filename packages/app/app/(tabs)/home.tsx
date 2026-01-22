import { View, Text, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Alert, Modal, TextInput } from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs, addDoc } from "firebase/firestore";
// Seu import que funciona:
import { firestore as db } from "../../firebase/firebaseConfig"; 

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [helps, setHelps] = useState<any[]>([]);
  
  // Estados para o Modal (Formulário)
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [saving, setSaving] = useState(false);

  // Buscar dados
  async function fetchHelps() {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "helps"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHelps(data);
    } catch (error) {
      console.log("Erro ao buscar:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchHelps(); }, []);

  // Salvar novo pedido
  async function handleSave() {
    if (!newTitle || !newDesc) return Alert.alert("Ops", "Preencha tudo!");
    
    setSaving(true);
    try {
      await addDoc(collection(db, "helps"), {
        title: newTitle,
        description: newDesc,
        createdAt: new Date().toISOString(),
        status: "open"
      });
      Alert.alert("Sucesso", "Pedido criado!");
      setModalVisible(false); // Fecha o modal
      setNewTitle(""); setNewDesc(""); // Limpa os campos
      fetchHelps(); // Atualiza a lista
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      {/* Cabeçalho */}
      <View style={{ padding: 20, paddingTop: 60, backgroundColor: "white", borderBottomWidth: 1, borderColor: "#E2E8F0" }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "#1E293B" }}>Ajudas Castanhal</Text>
      </View>

      {/* Lista de Pedidos */}
      <FlatList
        data={helps}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchHelps} />}
        ListEmptyComponent={() => (
          <View style={{ alignItems: "center", marginTop: 50 }}>
            <Text style={{ color: "#64748B" }}>Nenhum pedido ainda.</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: "white", padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#334155" }}>{item.title}</Text>
            <Text style={{ color: "#64748B", marginTop: 4 }}>{item.description}</Text>
          </View>
        )}
      />

      {/* Botão Flutuante (Abre o Modal) */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          position: "absolute", bottom: 24, right: 24, width: 56, height: 56,
          borderRadius: 28, backgroundColor: "#2563EB", justifyContent: "center", alignItems: "center", elevation: 5
        }}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      {/* --- O MODAL (FORMULÁRIO FLUTUANTE) --- */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ backgroundColor: "white", padding: 24, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>Novo Pedido</Text>
            
            <TextInput 
              placeholder="Título (ex: Cesta Básica)" 
              value={newTitle} onChangeText={setNewTitle}
              style={{ borderWidth: 1, borderColor: "#ddd", padding: 12, borderRadius: 8, marginBottom: 12 }}
            />
            
            <TextInput 
              placeholder="Descrição..." 
              value={newDesc} onChangeText={setNewDesc}
              multiline numberOfLines={3}
              style={{ borderWidth: 1, borderColor: "#ddd", padding: 12, borderRadius: 8, marginBottom: 20, textAlignVertical: 'top' }}
            />

            <TouchableOpacity 
              onPress={handleSave}
              disabled={saving}
              style={{ backgroundColor: "#2563EB", padding: 16, borderRadius: 12, alignItems: "center", marginBottom: 12 }}
            >
              {saving ? <ActivityIndicator color="white" /> : <Text style={{ color: "white", fontWeight: "bold" }}>Salvar Pedido</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ alignItems: "center", padding: 10 }}>
              <Text style={{ color: "#EF4444" }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}