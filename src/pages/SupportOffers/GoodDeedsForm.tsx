// src/pages/SupportOffers/GoodDeedsForm.tsx

import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonTextarea,
  IonButton,
  IonText,
  IonButtons,
  IonBackButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonListHeader,
  IonRadioGroup,
  IonRadio,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { arrowBackOutline, personCircleOutline, callOutline, createOutline } from 'ionicons/icons';

// Importa o novo componente ValidatedInput
import ValidatedInput from '../../components/ValidatedInput/ValidatedInput'; // AJUSTE O CAMINHO CONFORME SUA ESTRUTURA DE PASTAS

// --- Constantes para validação e mensagens ---
const NAME_REGEX = /^[a-zA-Z\s]*$/;
const PHONE_REGEX = /^[0-9]{10,11}$/; // Aceita 10 ou 11 dígitos

const MESSAGES = {
  REQUIRED_FIELDS: 'Por favor, preencha todos os campos obrigatórios.',
  NAME_INVALID: 'O campo "Nome completo" deve conter apenas letras e espaços.',
  PHONE_INVALID_FORMAT: 'O campo "Telefone" deve conter apenas números.',
  PHONE_INVALID_LENGTH: 'O campo "Telefone" deve ter 10 ou 11 números (incluindo o DDD).',
  HELP_OPTION_REQUIRED: 'Por favor, selecione uma opção de como você quer ajudar.',
  SUCCESS_MESSAGE: 'Obrigado por se oferecer para ajudar!',
};

const GoodDeedsForm: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [helpOption, setHelpOption] = useState('');
  const [message, setMessage] = useState('');
  const [globalError, setGlobalError] = useState('');

  // Estados para controle de validação visual individual
  const [isNameInvalid, setIsNameInvalid] = useState(false);
  const [isPhoneInvalid, setIsPhoneInvalid] = useState(false);
  const [isHelpOptionInvalid, setIsHelpOptionInvalid] = useState(false);

  // --- Handler para mudança nas opções de Ajuda ---
  const handleHelpOptionChange = (e: CustomEvent) => {
    setHelpOption(e.detail.value);
    setIsHelpOptionInvalid(false); // Reseta o estado de inválido ao selecionar
  };

  // --- Validação final no handleSubmit ---
  const handleSubmit = () => {
    // Resetar estados de validação e erros globais
    setGlobalError('');
    setIsNameInvalid(false);
    setIsPhoneInvalid(false);
    setIsHelpOptionInvalid(false);

    let hasErrors = false;

    // Validação de Nome
    if (!name.trim()) {
      setGlobalError(MESSAGES.REQUIRED_FIELDS);
      setIsNameInvalid(true);
      hasErrors = true;
    } else if (!NAME_REGEX.test(name)) {
      setGlobalError(MESSAGES.NAME_INVALID);
      setIsNameInvalid(true);
      hasErrors = true;
    }

    // Validação de Telefone
    if (!phone.trim()) {
      setGlobalError(MESSAGES.REQUIRED_FIELDS);
      setIsPhoneInvalid(true);
      hasErrors = true;
    } else if (!PHONE_REGEX.test(phone)) {
      // Mensagem de erro mais específica para telefone
      if (phone.length > 0 && (phone.length < 10 || phone.length > 11)) {
        setGlobalError(MESSAGES.PHONE_INVALID_LENGTH);
      } else {
        setGlobalError(MESSAGES.PHONE_INVALID_FORMAT);
      }
      setIsPhoneInvalid(true);
      hasErrors = true;
    }

    // Validação da opção de ajuda
    if (!helpOption) {
      setGlobalError(MESSAGES.HELP_OPTION_REQUIRED);
      setIsHelpOptionInvalid(true);
      hasErrors = true;
    }

    if (hasErrors) {
      return; // Impede o envio se houver erros
    }

    // Se tudo estiver válido, procede com o envio
    console.log({ name, phone, helpOption, message });
    alert(MESSAGES.SUCCESS_MESSAGE);

    // Limpa o formulário
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
            <IonBackButton defaultHref="/wantToSupport" text="">
              <IonIcon icon={arrowBackOutline} />
            </IonBackButton>
          </IonButtons>
          <IonTitle style={{ fontWeight: 'bold', fontSize: '18px' }}>
            Registro de Voluntariado
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent
        className="ion-padding"
        style={{
          '--background': 'linear-gradient(to bottom, #e0f7fa, #c8e6c9)',
        }}
      >
        <IonCard style={{
          borderRadius: '20px',
          boxShadow: '0 12px 25px rgba(0,0,0,0.15)',
          padding: '10px 0',
        }}>
          <IonCardHeader>
            <IonCardTitle style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#003366',
              textAlign: 'center'
            }}>
              💖 Suas Informações
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            {globalError && (
              <IonText color="danger" style={{ textAlign: 'center', display: 'block', marginBottom: '15px' }}>
                <p>{globalError}</p>
              </IonText>
            )}

            {/* Usando o componente ValidatedInput para o Nome */}
            <ValidatedInput
              label="Nome completo *"
              value={name}
              onValueChange={setName}
              icon={personCircleOutline}
              regex={NAME_REGEX}
              isInvalid={isNameInvalid}
              inputmode="text"
            />

            {/* Usando o componente ValidatedInput para o Telefone */}
            <ValidatedInput
              label="Telefone *"
              value={phone}
              onValueChange={setPhone}
              icon={callOutline}
              regex={PHONE_REGEX}
              isInvalid={isPhoneInvalid}
              type="tel"
              inputmode="numeric"
              maxlength={11}
            />

            {/* Opções de Ajuda (ainda aqui porque é um RadioGroup, que é mais complexo para generalizar) */}
            <IonList
              style={{
                '--background': 'transparent',
                background: 'transparent',
                border: isHelpOptionInvalid ? '1px solid red' : 'none',
                borderRadius: '8px',
                padding: '5px'
              }}
            >
              <IonListHeader>
                <IonLabel style={{ color: isHelpOptionInvalid ? 'red' : '#003366', fontWeight: '600' }}>Como você quer ajudar?</IonLabel>
              </IonListHeader>
              <IonRadioGroup
                value={helpOption}
                onIonChange={handleHelpOptionChange}
              >
                <IonItem lines="none" style={{ '--background': 'transparent' }}>
                  <IonLabel>Ajudar alguém do feed</IonLabel>
                  <IonRadio slot="end" value="especifico" />
                </IonItem>
                <IonItem lines="none" style={{ '--background': 'transparent' }}>
                  <IonLabel>Ajudar de forma geral</IonLabel>
                  <IonRadio slot="end" value="geral" />
                </IonItem>
              </IonRadioGroup>
            </IonList>

            {/* Campo Mensagem */}
            <IonItem lines="full" style={{ '--background': 'transparent', marginTop: '15px' }}>
              <IonIcon icon={createOutline} slot="start" color="primary" />
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
              disabled={!name || !phone || !helpOption}
              style={{
                '--background': '#00b3c6',
                '--background-activated': '#008c9e',
                '--color': '#ffffff',
                borderRadius: '12px',
                height: '55px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginTop: '30px',
                boxShadow: '0 8px 18px rgba(0, 179, 198, 0.4)',
              }}
            >
              Enviar
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default GoodDeedsForm;