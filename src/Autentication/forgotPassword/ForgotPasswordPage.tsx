import React, { useState } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonInput, 
  IonButton, 
  IonText, 
  IonItem, 
  IonLabel, 
  IonRouterLink,
  IonLoading
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { requestPasswordReset } from './forgotPasswordService'; // Importação do serviço de API

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const history = useHistory();

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setMessage('');

    // Chama a função do serviço de API para fazer a requisição
    const result = await requestPasswordReset(email);

    // Usa o resultado retornado para atualizar a interface
    if (result.success) {
      setMessage(result.message);
      setEmail('');
    } else {
      setMessage(result.message);
    }
    
    setIsSending(false);
  };

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding">
        <div style={{ maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
          <IonText>
            <h1>Recuperar Senha</h1>
          </IonText>
          <p>
            Digite seu e-mail para que possamos enviar as instruções de recuperação.
          </p>

          <form onSubmit={handlePasswordReset}>
            <IonItem className="ion-margin-bottom">
              <IonLabel position="floating">E-mail</IonLabel>
              <IonInput 
                type="email" 
                value={email}
                onIonChange={(e) => setEmail(e.detail.value!)}
                required
              />
            </IonItem>
            
            <IonButton 
              expand="block" 
              type="submit" 
              disabled={isSending || !email.trim()}
            >
              {isSending ? 'Enviando...' : 'Enviar'}
            </IonButton>
          </form>

          {message && (
            <IonText className="ion-margin-top">
              <p>{message}</p>
            </IonText>
          )}

          <IonRouterLink 
            routerLink="/login" 
            className="ion-margin-top ion-display-block"
          >
            Voltar para o Login
          </IonRouterLink>
        </div>
      </IonContent>
      
      <IonLoading
        isOpen={isSending}
        message={'Enviando...'}
        spinner="circles"
      />
    </IonPage>
  );
};

export default ForgotPasswordPage;