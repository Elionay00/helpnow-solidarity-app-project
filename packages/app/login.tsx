import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

// --- CONFIGURAÇÃO DA API ---
const api = axios.create({
  baseURL: 'http://192.168.3.38:3000', 
  timeout: 10000,
});

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/login', {
        email: email.toLowerCase().trim(),
        password: password
      });

      console.log('Login realizado com sucesso!', response.data);
      Alert.alert('Sucesso!', 'Bem-vindo ao HelpNow!');
      router.replace('/(tabs)'); 
    } catch (error: any) {
      console.error('Erro detalhado:', error);
      const msg = error.response?.data?.message || 'Erro de conexão. Verifique se o Backend está ligado!';
      Alert.alert('Falha no Login', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HelpNow Solidarity</Text>
      
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>

      {/* --- BOTÃO DE CADASTRAR ADICIONADO AQUI --- */}
      <TouchableOpacity onPress={() => router.push('/register')} style={styles.registerButton}>
        <Text style={styles.registerText}>Não tem conta? Cadastre-se aqui</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#007AFF' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  registerButton: { marginTop: 20 },
  registerText: { color: '#007AFF', textAlign: 'center', fontSize: 16 }
});