import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  useIonToast
} from '@ionic/react';
import { checkmarkCircleOutline } from 'ionicons/icons';
import React from 'react';
import styles from './PremiumFeatures.module.css';
import { ApiService } from '../../services/api.service';

const PremiumFeatures: React.FC = () => {
  const [presentToast] = useIonToast();

  const handlePayment = async () => {
    try {
      const response = await ApiService.createPaymentSession({ plano: 'DoadorPro' });
      
      if (response.url) {
        window.location.href = response.url;
      } else {
        presentToast({
            message: 'Erro ao criar a sessão de pagamento.',
            duration: 3000,
            color: 'danger'
        });
        console.error('Erro ao criar a sessão de pagamento.');
      }
    } catch (error) {
      presentToast({
        message: 'Erro ao iniciar o pagamento. Verifique sua conexão.',
        duration: 3000,
        color: 'danger'
      });
      console.error('Erro ao iniciar o pagamento:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>Seja um Doador Premium</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className={styles.background + ' ' + styles.contentCenter}>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Plano Doador Pro</IonCardTitle>
            <IonCardSubtitle>R$ 19,90 / mês</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
            <IonList lines="none">
              <IonItem>
                <IonIcon icon={checkmarkCircleOutline} slot="start" color="success"></IonIcon>
                <IonLabel>Selo de Doador Verificado</IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon icon={checkmarkCircleOutline} slot="start" color="success"></IonIcon>
                <IonLabel>Acesso a relatórios de impacto detalhados</IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon icon={checkmarkCircleOutline} slot="start" color="success"></IonIcon>
                <IonLabel>Notificações de pedidos em primeira mão</IonLabel>
              </IonItem>
            </IonList>

            <IonButton expand="block" color="success" className="ion-margin-top" onClick={handlePayment}>Assinar agora</IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default PremiumFeatures;