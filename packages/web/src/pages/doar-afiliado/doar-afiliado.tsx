import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonText
} from '@ionic/react';
import React from 'react';
import styles from './doar-afiliado.module.css';

// Link guardado numa constante para ser mais fácil de encontrar e alterar
const URL_CESTA_BASICA = 'https://www.amazon.com.br/Cesta-B%C3%A1sica-Alimentos-Pr%C3%A1tica-Higiene/dp/B08X4T6N2Q/';

const DoarAfiliado: React.FC = () => {
  
  const handleComprarEDoar = () => {
    window.open(URL_CESTA_BASICA, '_blank');
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
      
      {/* A MUDANÇA ESTÁ AQUI: Usamos a classe "ion-padding" para dar espaçamento */}
      <IonContent fullscreen className={styles.background + " ion-padding"}>
        
        {/* O conteúdo agora vai aparecer corretamente */}
        <IonText>
          <h1>Doe uma Cesta Básica</h1>
          <p>Seja um herói local e ajude uma família. Clique no botão abaixo para comprar a cesta básica em uma loja parceira. A loja fará a entrega para você, e a sua doação fará toda a diferença!</p>
        </IonText>
        <IonButton expand="block" color="success" className="ion-margin-top" onClick={handleComprarEDoar}>
          Comprar e Doar
        </IonButton>
        
      </IonContent>
    </IonPage>
  );
};

export default DoarAfiliado;