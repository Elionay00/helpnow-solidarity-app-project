import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Alert, 
  StyleSheet, 
  Text, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import axios from 'axios';

// 1. Configuração da API
const api = axios.create({ baseURL: 'http://192.168.3.38:3000' });

export default function NewOrder() {
  // 2. Estados para os campos
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // 3. Função para enviar os dados
  async function handleCreateOrder() {
    if (title === '' || description === '') {
      Alert.alert("Atenção", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      await api.post('/pedidos', {
        title,
        description,
        userId: 1, 
        status: "ABERTO"
      });

      Alert.alert("Sucesso!", "Seu pedido foi publicado!");
      setTitle('');
      setDescription('');
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Verifique se o backend está ligado no PM2.");
    }
  }

  // 4. O visual (JSX)
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Novo Pedido de Ajuda</Text>
      
      <Text style={styles.label}>O que você precisa?</Text>
      <TextInput 
        style={styles.input}
        placeholder="Ex: Alimentos, Remédios..."
        value={title}
        onChangeText={setTitle}
        placeholderTextColor="#999"
      />
      
      <Text style={styles.label}>Explique sua situação:</Text>
      <TextInput 
        style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
        placeholder="Conte detalhes aqui..."
        multiline
        value={description}
        onChangeText={setDescription}
        placeholderTextColor="#999"
      />
      
      <TouchableOpacity 
         style={styles.button} 
         onPress={handleCreateOrder}
         activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Publicar Pedido</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// 5. Estilos
const styles = StyleSheet.create({
  container: { 
    padding: 20, 
    backgroundColor: '#fff', 
    flexGrow: 1 
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center', 
    color: '#27ae60',
    marginTop: 20
  },
  label: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 5, 
    color: '#333' 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 20, 
    fontSize: 16, 
    color: '#000' 
  },
  button: {
    backgroundColor: '#27ae60',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }
});