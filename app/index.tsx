import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

const api = axios.create({ baseURL: 'http://10.0.0.178:3000' });

export default function Home() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function load() {
    try {
      setLoading(true);
      const res = await api.get('/pedidos');
      setPedidos(res.data);
    } catch (e) { 
      console.log("Erro ao buscar dados:", e); 
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Ajudas Castanhal</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <FlatList
            data={pedidos}
            keyExtractor={(item: any) => String(item.id)}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDesc}>{item.description}</Text>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.empty}>Nenhum pedido na rede.</Text>}
          />
        )}

        <TouchableOpacity 
          style={styles.fab}
          onPress={() => {
            // Tenta navegar. Se der erro, ele avisa no console
            try {
              router.push('/NewOrder');
            } catch (err) {
              console.log("Erro de navegação:", err);
            }
          }}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  content: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#1C1C1E', marginTop: 40 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  cardDesc: { fontSize: 14, color: '#666', marginTop: 5 },
  empty: { textAlign: 'center', marginTop: 50, color: '#999' },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#007AFF', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  fabText: { color: '#fff', fontSize: 35, fontWeight: '300' }
});