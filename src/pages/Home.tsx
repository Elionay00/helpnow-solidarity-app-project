import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

const Home: React.FC = () => {
  // Componente Home
  const history = useHistory();

   // Navega para Login
  const goToLogin = () => {
    history.push('/Login');
  };
  return (
    <IonPage>
     {/* Cabeçalho */}
      <IonHeader>
        <IonToolbar>
          <IonTitle>Início</IonTitle>
          {/* Botão de Login */}
          <IonButtons slot="end">
            <IonButton onClick={goToLogin}>
              Login
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

         {/* Conteúdo */}
      <IonContent fullscreen>
         {/* Cabeçalho */}
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Início</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer />
      </IonContent>
    </IonPage>
  );
};

export default Home;
