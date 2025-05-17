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
} from '@ionic/react';  // Importa os componentes da biblioteca Ionic
import { useState } from 'react';
import { useHistory } from 'react-router-dom'; // Hook para navegação entre páginas

const Login: React.FC = () => {
  // Declara os estados para email e senha
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const history = useHistory(); // Permite redirecionar o usuário para outra página

  const handleLogin = () => {
     // Ação disparada ao clicar no botão "Entrar"
    console.log('Login acionado para:', { email, password });
    history.push('/home'); // Redireciona para a página /home
  };

  return (
    <IonPage>
      {/* Cabeçalho da página */}
      <IonHeader>
        <IonToolbar>
          <IonTitle>Minha conta</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* Conteúdo principal */}
      <IonContent>
        <IonGrid>
          <IonRow className="ion-justify-content-center ion-align-items-center" style={{ height: '100%' }}>
            <IonCol size="12" sizeMd="6" sizeLg="4">
               {/* Cartão centralizado com os campos */}
              <IonCard className="ion-padding">
                <IonCardContent>
                    {/* Título de boas-vindas */}
                  <IonText color="primary">
                    <h2 className="ion-text-center" style={{ fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '8px', textAlign: 'center' }}>
                    <span></span>Bem-vindo ao ajuda já</h2>
                  </IonText>

                    {/* Campo de Email */}
                  <IonItem className="ion-margin-top">
                <IonLabel position="floating" style={{ marginBottom: '10px', fontSize: '16px', color: '#000', }}>
                Email
                </IonLabel>
                    <IonInput
                      type="email"
                      value={email}
                      onIonChange={e => setEmail(e.detail.value!)}
                      placeholder='Digite um email válido...'
                    />
                  </IonItem>

                  {/* Campo de Senha */}
                  <IonItem className="ion-margin-top">
                    <IonLabel position="floating" style={{ marginBottom: '10px', fontSize: '16px', color: '#000', }}>Senha</IonLabel>
                    <IonInput
                      type="password"
                      value={password}
                      onIonChange={e => setPassword(e.detail.value!)}
                      placeholder='Digite sua senha...'
                    />
                  </IonItem>

                  {/* Botão de Entrar, desabilitado se email ou senha estiverem vazios */}
                  <IonButton
                    expand="block"
                    className="ion-margin-top ion-margin-bottom"
                    onClick={handleLogin}
                    disabled={!email || !password}>
                    Entrar
                  </IonButton>
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