import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonButtons,
  IonBackButton,
} from '@ionic/react';
import { giftOutline, medkitOutline, flameOutline, pawOutline } from 'ionicons/icons';

const WantToSupport: React.FC = () => {
  
  // Objeto com os links de PESQUISA da Amazon para cada categoria
  const donationLinks = {
    cestaBasica: 'https://www.amazon.com.br/s?k=cesta+b%C3%A1sica',
    kitHigiene: 'https://www.amazon.com.br/s?k=kit+higiene+pessoal',
    kitGas: 'https://www.mercadolivre.com.br/c/cartao-presente-vale-gas', // Gás é melhor no Mercado Livre
    kitRacao: 'https://www.amazon.com.br/s?k=ra%C3%A7%C3%A3o+para+cachorro+e+gato',
  };

  // Função que abre o link numa nova aba
  const handleDonateClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Escolha como Ajudar</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        
        <p style={{ textAlign: 'center', marginBottom: '20px' }}>
          Clique numa das opções abaixo para ver uma lista de produtos que pode doar através dos nossos parceiros.
        </p>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={giftOutline} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
              Cesta Básica
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            Ajude uma família com alimentos essenciais.
            <IonButton expand="block" color="primary" className="ion-margin-top" onClick={() => handleDonateClick(donationLinks.cestaBasica)}>
              Ver Opções de Cestas
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={medkitOutline} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
              Kit de Higiene
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            Forneça produtos de higiene e limpeza.
            <IonButton expand="block" color="secondary" className="ion-margin-top" onClick={() => handleDonateClick(donationLinks.kitHigiene)}>
              Ver Opções de Kits
            </IonButton>
          </IonCardContent>
        </IonCard>
        
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={pawOutline} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
              Ração para Pets
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            Ajude a alimentar os animais de famílias carentes.
            <IonButton expand="block" color="warning" className="ion-margin-top" onClick={() => handleDonateClick(donationLinks.kitRacao)}>
              Ver Opções de Ração
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonHeader>
            <IonCardTitle>
              <IonIcon icon={flameOutline} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
              Gás de Cozinha
            </IonCardTitle>
          </IonHeader>
          <IonCardContent>
            Doe um vale-gás para que uma família possa cozinhar.
            <IonButton expand="block" color="danger" className="ion-margin-top" onClick={() => handleDonateClick(donationLinks.kitGas)}>
              Ver Opções de Vale-Gás
            </IonButton>
          </IonCardContent>
        </IonCard>

      </IonContent>
    </IonPage>
  );
};

export default WantToSupport;