import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

const Home: React.FC = () => {
  // Componente Home
  const history = useHistory();

   // Navega para Login
  const goToLogin = () => {
    history.push('/Home');
  };
  return (
    <IonPage>
     {/* Cabeçalho */}
      <IonHeader>
        <IonToolbar>
          <IonTitle>Início</IonTitle>
          {/* Botão de Login */}
          <IonButtons slot="end">
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
