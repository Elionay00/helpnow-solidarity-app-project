import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    // 1. Validar se o campo de e-mail está preenchido
    if (email.trim() === '') {
      Alert.alert('Erro', 'Por favor, digite seu e-mail.');
      return;
    }

    // 2. Iniciar o estado de carregamento
    setLoading(true);

    try {
      // 3. Fazer a chamada de API para o seu backend
      // **IMPORTANTE:** Substitua 'URL_DO_SEU_BACKEND_AQUI/forgot-password' pelo endereço real da sua API.
      const API_URL = 'URL_DO_SEU_BACKEND_AQUI/forgot-password';

      await axios.post(API_URL, { email });

      // 4. Exibir mensagem de sucesso para o usuário
      Alert.alert(
        'E-mail Enviado',
        'Um link de recuperação foi enviado para o seu e-mail. Verifique sua caixa de spam se não o encontrar.'
      );
      
      // 5. Limpar o campo de e-mail
      setEmail('');
    } catch (error) {
      // 6. Lidar com erros da requisição
      let errorMessage = 'Não foi possível enviar o e-mail. Tente novamente mais tarde.';

      if (error.response && error.response.data && error.response.data.message) {
        // Erro retornado pelo servidor
        errorMessage = error.response.data.message;
      } else if (error.request) {
        // Erro de conexão
        errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.';
      }

      Alert.alert('Erro', errorMessage);
    } finally {
      // 7. Parar o estado de carregamento, independente do resultado
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Esqueceu a senha?</Text>
      <Text style={styles.subtitle}>
        Informe o e-mail associado à sua conta para receber um link de recuperação.
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="exemplo@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleForgotPassword}
        disabled={loading} // Desabilita o botão enquanto a requisição está em andamento
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Enviar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ForgotPasswordPage;