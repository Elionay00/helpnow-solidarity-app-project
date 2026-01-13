import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Dados que depois virão do seu banco de dados
const PEDIDOS = [
  { 
    id: '1', 
    titulo: 'Cesta Básica', 
    local: 'Bairro: Jaderlândia', 
    cat: 'ALIMENTOS', 
    whatsapp: '5591999999999', // Coloque o número real aqui
    desc: 'Família com crianças precisando de alimentos básicos urgentes.' 
  },
  { 
    id: '2', 
    titulo: 'Roupas de Bebê', 
    local: 'Bairro: Centro', 
    cat: 'VESTUÁRIO', 
    whatsapp: '5591888888888',
    desc: 'Recém-nascido precisando de fraldas e roupinhas.' 
  },
  { 
    id: '3', 
    titulo: 'Medicamentos', 
    local: 'Bairro: Ianetama', 
    cat: 'SAÚDE', 
    whatsapp: '5591777777777',
    desc: 'Ajuda para comprar remédios de uso contínuo.' 
  },
];

export default function Home() {
  
  const handleAjuda = (numero: string, titulo: string) => {
    const mensagem = `Olá, vi o pedido de "${titulo}" no HelpNow e gostaria de ajudar!`;
    Linking.openURL(`https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>HelpNow</Text>
          <Text style={styles.headerSubtitle}>Castanhal Unida</Text>
        </View>
        <TouchableOpacity style={styles.notifIcon}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      {/* Lista */}
      <FlatList
        data={PEDIDOS}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.tag}><Text style={styles.tagText}>{item.cat}</Text></View>
              <Text style={styles.localText}>{item.local}</Text>
            </View>
            
            <Text style={styles.cardTitle}>{item.titulo}</Text>
            <Text style={styles.cardDesc}>{item.desc}</Text>
            
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => handleAjuda(item.whatsapp, item.titulo)}
            >
              <Ionicons name="logo-whatsapp" size={20} color="#FFF" style={{marginRight: 8}} />
              <Text style={styles.buttonText}>QUERO AJUDAR</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    paddingTop: 60, 
    paddingHorizontal: 25, 
    paddingBottom: 20, 
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE'
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#007BFF' },
  headerSubtitle: { fontSize: 14, color: '#666' },
  notifIcon: { padding: 8, backgroundColor: '#F0F0F0', borderRadius: 50 },
  listContainer: { padding: 20 },
  card: { 
    backgroundColor: '#FFF', 
    padding: 20, 
    borderRadius: 20, 
    marginBottom: 20, 
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  tag: { backgroundColor: '#E7F2FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tagText: { color: '#007BFF', fontSize: 10, fontWeight: 'bold' },
  localText: { fontSize: 12, color: '#999', fontWeight: '500' },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  cardDesc: { fontSize: 14, color: '#666', marginTop: 8, lineHeight: 20 },
  button: { 
    backgroundColor: '#25D366', // Cor do WhatsApp
    flexDirection: 'row',
    height: 50, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 20 
  },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 }
});