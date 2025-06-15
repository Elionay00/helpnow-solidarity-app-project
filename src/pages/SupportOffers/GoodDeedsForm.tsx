import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonRadioGroup,
  IonRadio,
  IonList,
  IonTextarea,
  IonButton,
  IonText,
  IonButtons,
  IonBackButton,
} from '@ionic/react';

const GoodDeedsForm: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [helpOption, setHelpOption] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim() || !helpOption) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    setError('');
    console.log({ name, phone, helpOption, message });
    alert('Obrigado por se oferecer para ajudar!');
    setName('');
    setPhone('');
    setHelpOption('');
    setMessage('');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            {/* Botão de voltar para WantToSupport */}
            <IonBackButton defaultHref="/wantToSupport" text="" />
          </IonButtons>
          <IonTitle>Registro de Voluntariado</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {error && (
          <IonText color="danger">
            <p style={{ marginBottom: '10px' }}>{error}</p>
          </IonText>
        )}

        <IonItem>
          <IonLabel position="floating">Nome completo *</IonLabel>
          <IonInput
            value={name}
            onIonChange={(e) => setName(e.detail.value!)}
            required
          />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Telefone *</IonLabel>
          <IonInput
            value={phone}
            onIonChange={(e) => setPhone(e.detail.value!)}
            type="tel"
            required
          />
        </IonItem>

        <IonList>
          <IonRadioGroup
            value={helpOption}
            onIonChange={(e) => setHelpOption(e.detail.value)}
          >
            <IonItem>
              <IonLabel>Quero ajudar alguém específico que vi no feed</IonLabel>
              <IonRadio slot="start" value="especifico" />
            </IonItem>

            <IonItem>
              <IonLabel>Quero ajudar por conta própria</IonLabel>
              <IonRadio slot="start" value="geral" />
            </IonItem>
          </IonRadioGroup>
        </IonList>

        <IonItem>
          <IonLabel position="floating">Mensagem / Observações</IonLabel>
          <IonTextarea
            value={message}
            onIonChange={(e) => setMessage(e.detail.value!)}
            rows={4}
          />
        </IonItem>

        <IonButton
          expand="block"
          onClick={handleSubmit}
          style={{ marginTop: '20px' }}
          disabled={!name || !phone || !helpOption}
        >
          Enviar
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default GoodDeedsForm;
