import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonIcon,
  useIonToast,
  useIonLoading,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { sendOutline, locationOutline } from 'ionicons/icons';

// Importações do Firebase
import { db, auth } from '../../firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const NeedHelp: React.FC = () => {
  const history = useHistory();
  const [presentToast] = useIonToast();
  const [presentLoading, dismissLoading] = useIonLoading();

  // Variáveis de estado (em inglês) para guardar os dados do formulário
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Controla se o formulário está a ser enviado

  // Função (em inglês) para lidar com o envio do formulário
  const handleFormSubmit = async () => {
    // 1. Validação para garantir que os campos não estão vazios
    if (!title.trim() || !description.trim()) {
      presentToast({ message: 'Por favor, preencha o título e a descrição.', duration: 2000, color: 'warning' });
      return;
    }

    // 2. Validação para garantir que o utilizador está autenticado
    if (!auth.currentUser) {
      presentToast({ message: 'Você precisa de estar logado para fazer um pedido.', duration: 3000, color: 'danger' });
      history.push('/login');
      return;
    }

    setIsSubmitting(true);
    presentLoading({ message: 'A obter a sua localização...' });

    // 3. Captura da localização do utilizador através da API do navegador
    if (!navigator.geolocation) {
      dismissLoading();
      setIsSubmitting(false);
      presentToast({ message: 'Geolocalização não é suportada neste navegador.', duration: 3000, color: 'danger' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // 4. Preparação do objeto (em inglês) com os dados do novo pedido
        const newRequest = {
          titulo: title,
          descricao: description,
          localizacao: {
            latitude: latitude,
            longitude: longitude,
          },
          userId: auth.currentUser?.uid, // ID do utilizador que fez o pedido
          createdAt: serverTimestamp(), // Data e hora do servidor
          status: 'aberto', // Status inicial do pedido
        };
        
        await presentLoading({ message: 'A enviar o seu pedido...' });
        
        // 5. Envio do novo pedido para a coleção 'pedidosDeAjuda' no Firebase
        try {
          await addDoc(collection(db, "pedidosDeAjuda"), newRequest);
          
          dismissLoading();
          presentToast({ message: 'O seu pedido foi enviado com sucesso!', duration: 2000, color: 'success' });
          
          // Redireciona o utilizador para o mapa para ver o seu novo pedido
          history.push('/mapa');

        } catch (error) {
          console.error("Error saving request: ", error);
          dismissLoading();
          setIsSubmitting(false);
          presentToast({ message: 'Ocorreu um erro ao enviar o seu pedido.', duration: 3000, color: 'danger' });
        }
      },
      (error) => {
        console.error("Geolocation error: ", error);
        dismissLoading();
        setIsSubmitting(false);
        presentToast({ message: 'Não foi possível obter a sua localização. Verifique as permissões.', duration: 3000, color: 'danger' });
      }
    );
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Pedir Ajuda</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Título do Pedido</IonLabel>
          <IonInput
            value={title}
            onIonChange={(e) => setTitle(e.detail.value!)}
            placeholder="Ex: Preciso de uma cesta básica"
          />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Descreva o que você precisa</IonLabel>
          <IonTextarea
            value={description}
            onIonChange={(e) => setDescription(e.detail.value!)}
            rows={6}
            placeholder="Descreva com mais detalhes a sua necessidade..."
          />
        </IonItem>

        <div className="ion-padding-top">
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'gray' }}>
            <IonIcon icon={locationOutline} style={{ verticalAlign: 'bottom' }} />
            A sua localização será partilhada para que a ajuda possa chegar até si.
          </p>
        </div>

        <IonButton
          expand="block"
          onClick={handleFormSubmit}
          disabled={isSubmitting}
          className="ion-margin-top"
        >
          <IonIcon slot="start" icon={sendOutline} />
          {isSubmitting ? 'A Enviar...' : 'Enviar Pedido de Ajuda'}
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default NeedHelp;
