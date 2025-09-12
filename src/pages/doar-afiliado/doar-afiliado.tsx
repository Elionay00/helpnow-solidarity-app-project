import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonText,
  useIonToast
} from '@ionic/react';
import React from 'react';
import styles from './doar-afiliado.module.css';
import { ApiService } from '../../services/api.service';

const DoarAfiliado: React.FC = () => {
  const [presentToast] = useIonToast();

  const handleComprarEDoar = async () => {
    try {
      const response = await ApiService.getAffiliateLink('cesta-basica');
      
      if (response.url) {
        window.open(response.url, '_blank');
      } else {
        presentToast({
            message: 'URL de afiliado não encontrada.',
            duration: 3000,
            color: 'danger'
        });
        console.error('URL de afiliado não encontrada.');
      }
    } catch (error) {
      presentToast({
        message: 'Erro ao buscar o link. Verifique sua conexão.',
        duration: 3000,
        color: 'danger'
      });
      console.error('Erro ao buscar o link:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>Comprar e Doar</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className={styles.background + ' ' + styles.contentCenter}>
        <div style={{ padding: '20px' }}>
          <IonText>
            <h1>Doe uma Cesta Básica</h1>
            <p>Seja um herói local e ajude uma família. Clique no botão abaixo para comprar a cesta básica em uma loja parceira. A loja fará a entrega para você, e a sua doação fará toda a diferença!</p>
          </IonText>
          <IonButton expand="block" color="success" className="ion-margin-top" onClick={handleComprarEDoar}>
            Comprar e Doar
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DoarAfiliado;