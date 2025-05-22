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
} from '@ionic/react';

import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import helpnowLogo from '../images/helpnow.png'; // Ajuste o caminho conforme necessário

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const history = useHistory();

  const handleLogin = () => {
    // Sem validação por enquanto — apenas navega para /home
    history.push('/home');
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
                      <img
                        src={helpnowLogo}
                        alt="Logo Ajuda Já"
                        style={{ height: '200px', objectFit: 'contain' }}
                      />
                    </div>
                  </IonText>

                  {/* Email */}
                  <IonItem className="ion-margin-top">
                    <IonLabel position="floating" style={{ fontSize: '16px', color: '#000', marginBottom: '6px' }}>
                      Email
                    </IonLabel>
                    <IonInput
                      type="email"
                      value={email}
                      onIonChange={e => setEmail(e.detail.value!)}
                      placeholder="Digite seu email..."
                    />
                  </IonItem>

                  {/* Senha */}
                  <IonItem className="ion-margin-top">
                    <IonLabel position="floating" style={{ fontSize: '16px', color: '#000', marginBottom: '6px' }}>
                      Senha
                    </IonLabel>
                    <IonInput
                      type="password"
                      value={password}
                      onIonChange={e => setPassword(e.detail.value!)}
                      placeholder="Digite sua senha..."
                    />
                  </IonItem>

                  {/* Botão Entrar */}
                  <IonButton
                    expand="block"
                    className="ion-margin-top ion-margin-bottom"
                    onClick={handleLogin}>
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
