import { useState } from 'react';
import { useIonToast } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebase/firebaseConfig';

export function useLoginLogic() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  // --- ADICIONADO ---
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const history = useHistory();
  const [presentToast] = useIonToast();

  const showToast = (message: string, color: string = 'danger') => {
    presentToast({
      message,
      duration: 3000,
      color,
      position: 'bottom',
    });
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showToast('Por favor, preencha seu email e senha.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToast('Login realizado com sucesso!', 'success');
      history.push('/home');
    } catch (err: any) {
      // ... (código de tratamento de erro continua o mesmo)
      console.error('Erro ao fazer login:', err.code, err.message);
      let errorMessage = 'Erro ao fazer login. Verifique seus dados e tente novamente.';
      switch (err.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'Email ou senha inválidos. Por favor, verifique e tente novamente.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'O formato do email é inválido. Digite um email válido.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Sua conta foi desativada. Entre em contato com o suporte.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Muitas tentativas de login. Tente novamente mais tarde.';
          break;
        default:
          errorMessage = `Ocorreu um erro: ${err.message}`;
          break;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    history.push('/register');
  };

  // --- ADICIONADO ---
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    goToRegister,
    loading,
    error,
    // --- ADICIONADO ---
    showPassword,
    toggleShowPassword,
  };
}