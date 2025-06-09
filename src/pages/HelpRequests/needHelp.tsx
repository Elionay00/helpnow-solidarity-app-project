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
  useIonToast,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from '@ionic/react';
import { useState } from 'react';

const NeedHelp: React.FC = () => {
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

    present({
      message: 'Pedido enviado com sucesso!',
      duration: 2000,
      color: 'success'
    });

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
      {/* Agrupação em um card */}
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle className="ion-text-center">Descreva sua necessidade</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <IonItem>
              <IonLabel position="floating">Localização</IonLabel>
              <IonInput
                style={{ marginTop: '3px' }}
                value={localizacao}
                onIonChange={e => setLocalizacao(e.detail.value!)}
                placeholder='Informe sua localização...'
              />
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

            <IonButton
              expand="block"
              className="ion-margin-top"
              color="primary"
              onClick={handleEnviarPedido}
            >
              Enviar Pedido
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default NeedHelp;