// src/Autentication/Login.tsx

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonText,
  useIonToast, //  NOVIDADE: Importação para usar Toast messages (as "mensagens separadas") 
} from '@ionic/react';

import { useState } from 'react'; // Importação do estado no React
import { useHistory } from 'react-router-dom'; // Importação do React Router 
import helpnowLogo from '../images/helpnow.png'; // Ajuste o caminho conforme necessário
import { eye, eyeOff } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Função principal para fazer login com email e senha
import { auth } from '../firebase/firebaseConfig'; // Sua instância do serviço de autenticação Firebase

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const history = useHistory();
  const [presentToast] = useIonToast(); //  NOVIDADE: Hook do Ionic para exibir toasts 
  const [mostrarSenha, setMostrarSenha] = useState<boolean>(false);

  // NOVIDADE: Função auxiliar para exibir as mensagens (toasts) de forma consistente 
  const showToast = (message: string, color: string = 'danger') => {
    presentToast({
      message,
      duration: 3000, // Mensagem aparece por 3 segundos
      color,         // Cor do toast (ex: 'danger' para erro, 'success' para sucesso)
      position: 'bottom', // Posição do toast na tela
    });
  };

  //  MUDANÇA PRINCIPAL: handleLogin agora é uma função assíncrona para interagir com o Firebase 
  const handleLogin = async () => {
    // 1. Validação Simples (você pode ter validações mais robustas aqui)
    if (!email || !password) {
      showToast('Por favor, preencha seu email e senha.');
      return; // Interrompe a função se os campos estiverem vazios
    }

    try {
      //  AÇÃO DO FIREBASE: Tenta fazer o login do usuário com email e senha fornecidos 
      await signInWithEmailAndPassword(auth, email, password);

      // Se o login for bem-sucedido:
      showToast('Login realizado com sucesso!', 'success'); // Exibe mensagem de sucesso
      history.push('/home'); // Redireciona para a página principal (Home)
    } catch (err: any) {
      // Se ocorrer um erro durante o login:
      console.error('Erro ao fazer login:', err.code, err.message); // Loga o erro completo para debug

      let errorMessage = 'Erro ao fazer login. Verifique seus dados e tente novamente.';

      //  NOVIDADE: Tratamento de erros específicos do Firebase para mensagens mais claras 
      // Isso "separa as mensagens" de erro e as torna mais compreensíveis para o usuário.
      switch (err.code) {
        case 'auth/user-not-found': // O email não está cadastrado
        case 'auth/wrong-password': // A senha está incorreta para o email
          errorMessage = 'Email ou senha inválidos. Por favor, verifique e tente novamente.';
          break;
        case 'auth/invalid-email': // O formato do email é inválido
          errorMessage = 'O formato do email é inválido. Digite um email válido.';
          break;
        case 'auth/user-disabled': // A conta do usuário foi desativada no Firebase
          errorMessage = 'Sua conta foi desativada. Entre em contato com o suporte.';
          break;
        case 'auth/too-many-requests': // Muitas tentativas falhas (segurança do Firebase)
          errorMessage = 'Muitas tentativas de login. Tente novamente mais tarde.';
          break;
        default: // Qualquer outro erro não tratado especificamente
          errorMessage = `Ocorreu um erro: ${err.message}`; // Mensagem genérica com o detalhe do erro
          break;
      }
      showToast(errorMessage); // Exibe a mensagem de erro (já "separada" e customizada)
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Minha conta</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonGrid>
          <IonRow className="ion-justify-content-center ion-align-items-center" style={{ height: '100%' }}>
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <IonCard className="ion-padding">
                <IonCardContent>

                  <IonText color="primary">
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: '16px'
                    }}>
                       {/* Logo */}
                      <img
                        src={helpnowLogo}
                        alt="Logo Ajuda Já"
                        style={{ height: '200px', objectFit: 'contain' }}
                      />
                    </div>
                  </IonText>

                  {/* Campo Email */}
                  <IonItem className="ion-margin-top">
                    <IonLabel position="floating" style={{ fontSize: '16px', color: '#000', marginBottom: '6px' }}>
                      <strong>Email</strong>
                    </IonLabel>
                    <IonInput
                      type="email"
                      value={email}
                      onIonChange={e => setEmail(e.detail.value!)}
                      placeholder="Digite seu email..."
                    />
                  </IonItem>

                  {/* Campo Senha */}
                  <IonItem className="ion-margin-top">
                    <IonLabel position="floating" style={{ fontSize: '16px', color: '#000', marginBottom: '6px' }}>
                      <strong>Senha</strong>
                    </IonLabel>
                    {/* Ícone do "olhinho" que alterna a visibilidade da senha */}
                    <IonInput
                      type={mostrarSenha ? 'text' : 'password'}
                      value={password}
                      onIonChange={e => setPassword(e.detail.value!)}
                      placeholder="Digite sua senha..."
                      style={{ width: '90%' }}
                    />
                    <IonIcon
                      icon={mostrarSenha ? eyeOff : eye}
                      slot="end"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      style={{ fontSize: '20px', cursor: 'pointer', marginLeft: '8px', marginTop: '45px' }}
                    />
                  </IonItem>

                  {/* Botão Entrar */}
                  <IonButton
                    expand="block"
                    className="ion-margin-top ion-margin-bottom"
                    onClick={handleLogin}>
                    Entrar
                  </IonButton>

                  {/* Link para Cadastro */}
                  <p className="ion-text-center ion-margin-top">
                    <strong>Não tem uma conta?</strong> <a onClick={() => history.push('/register')}>Cadastre-se aqui.</a>
                  </p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;