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
  IonIcon
} from '@ionic/react';
import { eye, eyeOff } from 'ionicons/icons';
import helpnowLogo from "../../../images/helpnow.png";
import { useLoginLogic } from '../logicLayer/LoginLogic'; // Import do hook

const LoginPresentation: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    handleLogin,
    goToRegister,
  } = useLoginLogic();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{ fontWeight: 'bold', fontSize: '18px' }}>Minha conta</IonTitle>
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
                    <IonInput
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onIonChange={e => setPassword(e.detail.value!)}
                      placeholder="Digite sua senha..."
                      style={{ width: '90%' }}
                    />
                    <IonIcon
                      icon={showPassword ? eyeOff : eye}
                      slot="end"
                      onClick={() => setShowPassword(!showPassword)}
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
                    <strong>Não tem uma conta?</strong>{' '}
                    <a onClick={goToRegister} style={{ cursor: 'pointer' }}>Cadastre-se aqui.</a>
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

export default LoginPresentation;