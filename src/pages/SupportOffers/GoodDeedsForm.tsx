import React, { useState } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonTextarea,
    IonInput,
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
    useIonToast,
    IonLoading
} from '@ionic/react';
import {
    arrowBackOutline,
    personCircleOutline,
    callOutline,
    createOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

// Importações do Firebase
import { db, auth } from '../../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

// --- Constantes para validação e mensagens ---
const NAME_REGEX = /^[a-zA-Z\s]*$/;
const PHONE_REGEX = /^[0-9]{10,11}$/;

const MESSAGES = {
    REQUIRED_FIELDS: 'Por favor, preencha todos os campos obrigatórios.',
    NAME_INVALID: 'O campo "Nome completo" deve conter apenas letras e espaços.',
    PHONE_INVALID_FORMAT: 'O campo "Telefone" deve conter apenas números.',
    PHONE_INVALID_LENGTH: 'O campo "Telefone" deve ter 10 ou 11 números (incluindo o DDD).',
    HELP_OPTION_REQUIRED: 'Por favor, selecione uma opção de como você quer ajudar.',
    SUCCESS_MESSAGE: 'Obrigado por se oferecer para ajudar!',
};

const GoodDeedsForm: React.FC = () => {
    const history = useHistory();
    const [presentToast] = useIonToast();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [helpOption, setHelpOption] = useState('');
    const [message, setMessage] = useState('');
    const [globalError, setGlobalError] = useState('');
    const [loading, setLoading] = useState(false);

    const [isNameInvalid, setIsNameInvalid] = useState(false);
    const [isPhoneInvalid, setIsPhoneInvalid] = useState(false);
    const [isHelpOptionInvalid, setIsHelpOptionInvalid] = useState(false);

    const handleHelpOptionChange = (e: CustomEvent) => {
        setHelpOption(e.detail.value);
        setIsHelpOptionInvalid(false);
    };

    const handleSubmit = async () => {
        setGlobalError('');
        setIsNameInvalid(false);
        setIsPhoneInvalid(false);
        setIsHelpOptionInvalid(false);

        let hasErrors = false;

        if (!name.trim()) {
            setGlobalError(MESSAGES.REQUIRED_FIELDS);
            setIsNameInvalid(true);
            hasErrors = true;
        } else if (!NAME_REGEX.test(name)) {
            setGlobalError(MESSAGES.NAME_INVALID);
            setIsNameInvalid(true);
            hasErrors = true;
        }

        if (!phone.trim()) {
            setGlobalError(MESSAGES.REQUIRED_FIELDS);
            setIsPhoneInvalid(true);
            hasErrors = true;
        } else if (!PHONE_REGEX.test(phone)) {
            if (phone.length > 0 && (phone.length < 10 || phone.length > 11)) {
                setGlobalError(MESSAGES.PHONE_INVALID_LENGTH);
            } else {
                setGlobalError(MESSAGES.PHONE_INVALID_FORMAT);
            }
            setIsPhoneInvalid(true);
            hasErrors = true;
        }

        if (!helpOption) {
            setGlobalError(MESSAGES.HELP_OPTION_REQUIRED);
            setIsHelpOptionInvalid(true);
            hasErrors = true;
        }

        if (hasErrors) return;

        // --- Lógica para salvar no Firebase ---
        setLoading(true);
        const user = auth.currentUser;

        if (!user) {
            setGlobalError("Você precisa estar logado para enviar sua oferta de ajuda.");
            setLoading(false);
            return;
        }

        try {
            await addDoc(collection(db, "ofertasDeAjuda"), {
                userId: user.uid, // Associa a oferta ao ID do usuário
                nome: name,
                telefone: phone,
                tipoDeAjuda: helpOption,
                mensagem: message,
                createdAt: new Date(),
            });

            setLoading(false);
            presentToast({
                message: MESSAGES.SUCCESS_MESSAGE,
                duration: 3000,
                color: 'success'
            });

            // Redireciona para a página inicial ou de perfil após o sucesso
            history.replace('/home');

            // Limpar os campos do formulário
            setName('');
            setPhone('');
            setHelpOption('');
            setMessage('');

        } catch (error) {
            setLoading(false);
            console.error("Erro ao salvar a oferta de ajuda:", error);
            setGlobalError("Ocorreu um erro ao enviar sua oferta. Por favor, tente novamente.");
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/quero-ajudar" text="">
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
                <IonCard
                    style={{
                        borderRadius: '20px',
                        boxShadow: '0 12px 25px rgba(0,0,0,0.15)',
                        padding: '10px 0',
                    }}
                >
                    <IonCardHeader>
                        <IonCardTitle
                            style={{
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                color: '#003366',
                                textAlign: 'center',
                            }}
                        >
                            💖 Suas Informações
                        </IonCardTitle>
                    </IonCardHeader>

                    <IonCardContent>
                        {globalError && (
                            <IonText
                                color="danger"
                                style={{
                                    textAlign: 'center',
                                    display: 'block',
                                    marginBottom: '15px',
                                }}
                            >
                                <p>{globalError}</p>
                            </IonText>
                        )}

                        {/* Campo Nome */}
                        <IonItem
                            lines="none"
                            style={{ '--background': 'transparent', marginBottom: '15px' }}
                        >
                            <IonIcon icon={personCircleOutline} slot="start" color="primary" />
                            <IonInput
                                label="Nome completo *"
                                labelPlacement="floating"
                                fill="outline"
                                placeholder="Digite seu nome completo"
                                value={name}
                                onIonInput={(e) => setName(e.detail.value!)}
                                className={isNameInvalid ? 'ion-invalid' : ''}
                                inputmode="text"
                            ></IonInput>
                        </IonItem>

                        {/* Campo Telefone */}
                        <IonItem
                            lines="none"
                            style={{ '--background': 'transparent', marginBottom: '15px' }}
                        >
                            <IonIcon icon={callOutline} slot="start" color="primary" />
                            <IonInput
                                label="Telefone *"
                                labelPlacement="floating"
                                fill="outline"
                                placeholder="Digite seu telefone (somente números)"
                                value={phone}
                                onIonInput={(e) => setPhone(e.detail.value!)}
                                className={isPhoneInvalid ? 'ion-invalid' : ''}
                                inputmode="numeric"
                                maxlength={11}
                                type="tel"
                            ></IonInput>
                        </IonItem>

                        {/* Opções de Ajuda */}
                        <IonList
                            style={{
                                '--background': 'transparent',
                                background: 'transparent',
                                border: isHelpOptionInvalid ? '1px solid red' : 'none',
                                borderRadius: '8px',
                                padding: '5px',
                                marginBottom: '15px',
                            }}
                        >
                            <IonListHeader>
                                <IonLabel
                                    style={{
                                        color: isHelpOptionInvalid ? 'red' : '#003366',
                                        fontWeight: '600',
                                    }}
                                >
                                    Como você quer ajudar?
                                </IonLabel>
                            </IonListHeader>
                            <IonRadioGroup value={helpOption} onIonChange={handleHelpOptionChange}>
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
                        <IonItem
                            lines="full"
                            style={{ '--background': 'transparent', marginTop: '15px' }}
                        >
                            <IonIcon icon={createOutline} slot="start" color="primary" />
                            <IonLabel position="floating">Mensagem / Observações</IonLabel>
                            <IonTextarea
                                value={message}
                                onIonInput={(e) => setMessage(e.detail.value!)}
                                rows={4}
                            />
                        </IonItem>

                        <IonButton
                            expand="block"
                            onClick={handleSubmit}
                            disabled={!name || !phone || !helpOption || loading}
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
                
                <IonLoading isOpen={loading} message={'Enviando sua oferta...'} spinner="crescent" />
            </IonContent>
        </IonPage>
    );
};

export default GoodDeedsForm;