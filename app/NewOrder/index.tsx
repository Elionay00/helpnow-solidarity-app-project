import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function NewOrder() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  // Garanta que o IP abaixo é o 10.0.0.178
  const api = axios.create({ baseURL: 'http://10.0.0.178:3000' });

  async function handleSave() {
    if (!title.trim() || !description.trim()) {
      return Alert.alert("Aviso", "Por favor, preencha o título e a descrição.");
    }

    try {
      // O backend espera exatamente esses nomes: title, description, userId, status
      await api.post('/pedidos', { 
        title: title, 
        description: description, 
        userId: 1, 
        status: "ABERTO" 
      });

      Alert.alert("Sucesso!", "Seu pedido foi salvo em Castanhal.");
      router.replace('/'); // Volta para a lista principal
    } catch (e) { 
      console.log(e);
      Alert.alert("Erro ao Salvar", "O servidor não respondeu. Verifique se o backend está ligado no seu Mac."); 
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>O que você precisa?</Text>
        <TextInput 
          placeholder="Ex: Cesta básica, Remédios..." 
          value={title} 
          onChangeText={setTitle} 
          style={styles.input} 
        />

        <Text style={styles.label}>Conte os detalhes:</Text>
        <TextInput 
          placeholder="Descreva sua situação..." 
          value={description} 
          onChangeText={setDescription} 
          style={[styles.input, { height: 120, textAlignVertical: 'top' }]} 
          multiline 
        />

        <TouchableOpacity onPress={handleSave} style={styles.button}>
          <Text style={styles.buttonText}>SALVAR PEDIDO</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={{ color: '#666' }}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 10, marginBottom: 20, fontSize: 16 },
  button: { backgroundColor: '#27ae60', padding: 18, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});