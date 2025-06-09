// src/pages/QueroAjudar.tsx

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonText,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

const wantToSupport: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="success">
          <IonTitle className="ion-text-center">Quero Ajudar</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding ion-text-center">
        <IonText>
          <h2>💖 Seja um herói para alguém!</h2>
          <p>Cadastre-se como voluntário e veja os pedidos de ajuda próximos.</p>
        </IonText>

        <IonButton expand="block" color="primary" routerLink="/feed">
          Ver pedidos de ajuda
        </IonButton>

        <IonButton expand="block" color="medium" onClick={() => history.goBack()} style={{ marginTop: 12 }}>
          Voltar
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default wantToSupport;
