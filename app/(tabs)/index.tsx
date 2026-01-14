import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';

const api = axios.create({ baseURL: 'http://192.168.3.38:3000' });

interface Order {
  id: number;
  title: string;
  description: string;
  status: string;
}

export default function HomeScreen() {
  const [pedidos, setPedidos] = useState<Order[]>([]);
  const router = useRouter();

  async function loadPedidos() {
    try {
      const response = await api.get('/pedidos');
      setPedidos(response.data);
    } catch (error) {
      console.log("Erro ao carregar:", error);
    }
  }

  useEffect(() => { loadPedidos(); }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ajudas em Castanhal</Text>
        <TouchableOpacity onPress={loadPedidos}>
          <Ionicons name="refresh-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={pedidos}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.userName}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
        ListEmptyComponent={() => <Text style={{ textAlign: 'center', marginTop: 50 }}>Nenhum pedido ainda.</Text>}
      />

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/NewOrder')}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', marginTop: 30 },
  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  listContent: { padding: 15 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15 },
  userName: { fontSize: 16, fontWeight: 'bold' },
  description: { fontSize: 14, color: '#666', marginTop: 5 },
  fab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#007AFF', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
});