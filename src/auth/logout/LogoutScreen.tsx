// src/pages/logout/LogoutScreen.tsx
import React from 'react';
import { IonPage, IonContent, IonText, IonButton, IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './LogoutScreen.css';

const LogoutScreen: React.FC = () => {
  const history = useHistory();

  const handleReturnToLogin = () => {
    // Você pode adicionar a lógica de logout aqui, como limpar o token
    // Exemplo: localStorage.removeItem('authToken');
    history.replace('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sair</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding logout-container">
        <div className="content-wrapper">
          <IonText className="logout-message">
            <h2>👋 Você saiu com sucesso</h2>
            <p>Esperamos te ver novamente em breve.</p>
          </IonText>
          <IonButton expand="block" onClick={handleReturnToLogin}>
            Fazer Login Novamente
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LogoutScreen;