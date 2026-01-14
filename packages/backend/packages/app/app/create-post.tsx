import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

export default function CreatePost() {
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Pedido'); // Pedido ou Doação
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (!description) {
      Alert.alert('Erro', 'Escreva o que você precisa ou quer doar');
      return;
    }

    setLoading(true);
    try {
      // Tenta enviar para o seu Mac
      await axios.post('http://192.168.3.38:3000/posts', {
        description,
        type,
        userId: 1 // Por enquanto fixo
      });

      Alert.alert('Sucesso!', 'Publicado em Castanhal!');
      router.back(); 
    } catch (error) {
      // Vai dar erro aqui se não atualizarmos o Backend ainda, mas a tela já vai abrir!
      Alert.alert('Erro', 'Ainda não conectamos essa parte no servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>O que você precisa?</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Ex: Preciso de doação de alimentos ou quero doar roupas..."
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Publicar</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, height: 150, textAlignVertical: 'top', marginBottom: 20 },
  saveButton: { backgroundColor: '#34C759', padding: 15, borderRadius: 8, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});