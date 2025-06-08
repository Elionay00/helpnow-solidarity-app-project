// src/pages/PrecisoDeAjuda.tsx

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonText,
  IonButton,
  IonTextarea,
  IonInput,
  IonItem,
  IonLabel,
  IonToast,
  useIonToast
} from '@ionic/react';
import { useState } from 'react';

const PrecisoDeAjuda: React.FC = () => {
  const [descricao, setDescricao] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [present] = useIonToast();

  const handleEnviarPedido = () => {
    if (!descricao || !localizacao) {
      present({
        message: 'Preencha todos os campos!',
        duration: 2000,
        color: 'danger'
      });
      return;
    }

    // Aqui você pode salvar no Firebase Firestore ou outro backend
    present({
      message: 'Pedido enviado com sucesso!',
      duration: 2000,
      color: 'success'
    });

    // Limpa os campos
    setDescricao('');
    setLocalizacao('');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Preciso de Ajuda</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonText>
          <h2>Descreva sua necessidade</h2>
        </IonText>

        <IonItem>
          <IonLabel position="floating">Localização</IonLabel>
          <IonInput value={localizacao} onIonChange={e => setLocalizacao(e.detail.value!)} />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Descrição do pedido</IonLabel>
          <IonTextarea
            rows={6}
            value={descricao}
            onIonChange={e => setDescricao(e.detail.value!)}
            placeholder="Ex: Preciso de doação de alimentos..."
          />
        </IonItem>

        <IonButton expand="block" className="ion-margin-top" onClick={handleEnviarPedido}>
          Enviar Pedido
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default PrecisoDeAjuda;
