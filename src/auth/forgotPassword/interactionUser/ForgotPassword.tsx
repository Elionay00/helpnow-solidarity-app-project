import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonIcon,
  IonText,
  IonSegment,
  IonSegmentButton
} from '@ionic/react';
import { mailOutline, arrowBackOutline, callOutline } from 'ionicons/icons';
import { useForgotPasswordLogic } from '../logicLayer/ForgotPasswordLogic';

const ForgotPassword: React.FC = () => {
  const { email, setEmail, handleResetPassword, handleGoBack } = useForgotPasswordLogic();
  const [method, setMethod] = useState<'email' | 'phone'>('email');

  return (
    <IonPage>
      <IonContent className="ion-padding">
        {/* Botão de Voltar */}
        <div style={{ marginTop: '10px' }}>
          <IonButton fill="clear" onClick={handleGoBack} style={{ '--color': '#666' }}>
            <IonIcon icon={arrowBackOutline} slot="start" />
            <IonText>Voltar</IonText>
          </IonButton>
        </div>

        {/* Título Central */}
        <div style={{ textAlign: 'center', padding: '10px 20px' }}>
          <h2 style={{ fontWeight: 'bold' }}>Recuperar Conta</h2>
          <p style={{ color: '#666' }}>Escolha como deseja recuperar sua senha</p>
        </div>

        {/* Seletor de Método (E-mail ou Celular) */}
        <IonSegment 
          value={method} 
          onIonChange={(e) => {
            const val = e.detail.value;
            if (val === 'email' || val === 'phone') {
              setMethod(val);
            }
          }}
          style={{ marginBottom: '20px' }}
        >
          <IonSegmentButton value="email">
            <IonLabel>E-mail</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="phone">
            <IonLabel>Celular</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {/* Conteúdo dinâmico baseado na escolha */}
        <div style={{ marginTop: '10px' }}>
          {method === 'email' ? (
            <div style={{ padding: '0 10px' }}>
              <IonLabel position="stacked" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                E-mail cadastrado
              </IonLabel>
              <IonItem lines="none" style={{ '--background': 'transparent', '--padding-start': '0' }}>
                <IonIcon icon={mailOutline} slot="start" style={{ marginRight: '10px', color: '#007bff' }} />
                <IonInput
                  fill="outline"
                  type="email"
                  value={email}
                  placeholder="exemplo@email.com"
                  onIonInput={(e) => setEmail(e.detail.value?.toString() || '')}
                  style={{ width: '100%' }}
                />
              </IonItem>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px 20px', color: '#666' }}>
              <IonIcon icon={callOutline} style={{ fontSize: '64px', color: '#ccc' }} />
              <p style={{ marginTop: '15px' }}>
                A recuperação por <strong>SMS</strong> exige o plano pago do Firebase.
              </p>
              <IonText color="primary">
                Por favor, utilize a aba de <strong>E-mail</strong> para este teste.
              </IonText>
            </div>
          )}

          {/* Botão Principal */}
          <IonButton
            expand="block"
            onClick={handleResetPassword}
            disabled={method === 'phone'}
            style={{ 
              marginTop: '40px', 
              '--background': '#007bff',
              '--border-radius': '8px',
              height: '50px'
            }}
          >
            {method === 'email' ? 'Enviar Link de Redefinição' : 'Recuperar via SMS'}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ForgotPassword;