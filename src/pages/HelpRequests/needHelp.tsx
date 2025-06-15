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
  useIonToast,
  IonButtons,
  IonBackButton,
  IonIcon,
} from '@ionic/react';
import { useState } from 'react';
import { arrowBackOutline } from 'ionicons/icons'; // Ícone para o botão de voltar

const NeedHelp: React.FC = () => {
  const [descricao, setDescricao] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [present] = useIonToast();

  // Função chamada ao clicar em "Enviar Pedido"
  const handleEnviarPedido = () => {
    if (!descricao || !localizacao) {
      present({
        message: 'Preencha todos os campos!',
        duration: 2000,
        color: 'danger',
      });
      return;
    }

    present({
      message: 'Pedido enviado com sucesso!',
      duration: 2000,
      color: 'success',
    });

    setDescricao('');
    setLocalizacao('');
  };

  return (
    <IonPage>
      {/* Cabeçalho com botão de voltar */}
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" text="">
              <IonIcon icon={arrowBackOutline} />
            </IonBackButton>
          </IonButtons>
          <IonTitle style={{fontWeight: 'bold', fontSize: '18px' }}>Preciso de ajuda</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* Conteúdo com gradiente e centralização */}
      <IonContent
        fullscreen
        className="ion-padding"
        style={{
          '--background': 'linear-gradient(to bottom, #e0f7fa, #c8e6c9)',
        }}
      >
        {/* Container centralizado */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            maxWidth: '600px',
            margin: '0 auto',
            padding: '20px',
            boxSizing: 'border-box',
          }}
        >
          {/* Cartão com sombra e bordas arredondadas */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '30px 25px',
              boxShadow: '0 12px 25px rgba(0,0,0,0.2)',
              width: '100%',
            }}
          >
            <IonText>
              <h2
                style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  marginBottom: '20px',
                  color: '#003366',
                  textAlign: 'center',
                }}
              >
                🆘 Descreva sua necessidade
              </h2>
            </IonText>

            {/* Campo de Localização */}
            <IonItem lines="inset">
              <IonLabel position="floating">Localização</IonLabel>
              <IonInput
                value={localizacao}
                onIonChange={(e) => setLocalizacao(e.detail.value!)}
                placeholder="Informe sua localização..."
              />
            </IonItem>

            {/* Campo de Descrição */}
            <IonItem lines="inset">
              <IonLabel position="floating">Descrição do pedido</IonLabel>
              <IonTextarea
                rows={6}
                value={descricao}
                onIonChange={(e) => setDescricao(e.detail.value!)}
                placeholder="Ex: Preciso de doação de alimentos..."
              />
            </IonItem>

            {/* Botão Enviar Pedido */}
            <IonButton
              expand="block"
              onClick={handleEnviarPedido}
              style={{
                '--background': '#00b3c6',
                '--background-activated': '#008c9e',
                '--color': '#ffffff',
                borderRadius: '12px',
                height: '50px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                marginTop: '25px',
                boxShadow: '0 8px 18px rgba(0, 179, 198, 0.4)',
              }}
            >
              Enviar Pedido
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default NeedHelp;
