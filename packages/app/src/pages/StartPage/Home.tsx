import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonText
} from '@ionic/react';

/* --- IMPORTAÇÃO DE ÍCONES "À PROVA DE ERROS" --- */
// Troquei para nomes universais que o Ionic aceita em qualquer versão
import { 
  helpCircle, 
  heart, 
  people, 
  star 
} from 'ionicons/icons';

import { useHistory } from 'react-router-dom';

const Home: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary">
          <IonTitle>HelpNow Solidarity</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <div style={{ textAlign: 'center', marginBottom: '20px', marginTop: '10px' }}>
          <IonText color="dark">
            <h1 style={{ fontWeight: 'bold' }}>Olá! O que vamos fazer hoje?</h1>
          </IonText>
          <p style={{ color: '#666' }}>Transforme o dia de alguém com um pequeno gesto.</p>
        </div>

        <IonGrid>
          <IonRow>
            {/* CARD: PRECISO DE AJUDA */}
            <IonCol size="12">
              <IonCard mode="ios" style={{ borderLeft: '5px solid #eb445a' }}>
                <IonCardHeader>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <IonIcon icon={helpCircle} style={{ fontSize: '35px' }} color="danger" />
                    <div>
                      <IonCardTitle>Preciso de Ajuda</IonCardTitle>
                      <IonCardSubtitle>Criar novo pedido</IonCardSubtitle>
                    </div>
                  </div>
                </IonCardHeader>
                <IonCardContent>
                  Está passando por uma dificuldade? Publique seu pedido para que a comunidade possa te encontrar.
                </IonCardContent>
                <div className="ion-padding">
                  <IonButton expand="block" color="danger" shape="round" onClick={() => history.push('/preciso-de-ajuda')}>
                    Pedir Ajuda Agora
                  </IonButton>
                </div>
              </IonCard>
            </IonCol>

            {/* CARD: QUERO AJUDAR */}
            <IonCol size="12">
              <IonCard mode="ios" style={{ borderLeft: '5px solid #2dd36f' }}>
                <IonCardHeader>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <IonIcon icon={heart} style={{ fontSize: '35px' }} color="success" />
                    <div>
                      <IonCardTitle>Quero Ajudar</IonCardTitle>
                      <IonCardSubtitle>Ver quem precisa</IonCardSubtitle>
                    </div>
                  </div>
                </IonCardHeader>
                <IonCardContent>
                  Veja quem está precisando de apoio por perto e ofereça sua mão amiga.
                </IonCardContent>
                <div className="ion-padding">
                  <IonButton expand="block" color="success" shape="round" onClick={() => history.push('/quero-ajudar')}>
                    Explorar Pedidos
                  </IonButton>
                </div>
              </IonCard>
            </IonCol>

            {/* BOTÕES DE ATALHO */}
            <IonCol size="6">
              <IonCard mode="ios" className="ion-text-center" onClick={() => history.push('/feed')}>
                <IonCardContent>
                  <IonIcon icon={people} style={{ fontSize: '28px' }} color="primary" />
                  <p style={{ marginTop: '5px' }}>Comunidade</p>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="6">
              <IonCard mode="ios" className="ion-text-center" onClick={() => history.push('/premium-features')}>
                <IonCardContent>
                  <IonIcon icon={star} style={{ fontSize: '28px' }} color="warning" />
                  <p style={{ marginTop: '5px' }}>Premium</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;