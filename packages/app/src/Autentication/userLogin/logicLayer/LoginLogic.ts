// /packages/_web/src/Autentication/userLogin/logicLayer/LoginLogic.ts - CÓDIGO COMPLETO

import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebase/firebaseConfig'; // Verifique se o caminho para firebaseConfig está correto

export const useLoginLogic = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const history = useHistory();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor, preencha o e-mail e a senha.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // A MÁGICA DO FIREBASE ACONTECE AQUI
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login bem-sucedido!', userCredential.user);

      // Redireciona para a página principal após o login
      history.push('/tabs/home');

    } catch (err: any) {
      console.error("Erro no login:", err.code);
      // Traduz o erro do Firebase para uma mensagem amigável
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('E-mail ou senha inválidos.');
      } else {
        setError('Ocorreu um erro ao tentar fazer o login.');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleLogin,
    showPassword,
    toggleShowPassword,
  };
};