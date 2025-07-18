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

  // Estados para guardar os dados do formulário
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Função principal que é chamada ao clicar no botão
  const handleFormSubmit = async () => {
    // 1. Validar se os campos foram preenchidos
    if (!titulo.trim() || !descricao.trim()) {
      presentToast({
        message: 'Por favor, preencha o título e a descrição.',
        duration: 2000,
        color: 'warning',
      });
      return;
    }

    // 2. Validar se o utilizador está autenticado
    if (!auth.currentUser) {
      presentToast({
        message: 'Você precisa de estar logado para fazer um pedido.',
        duration: 3000,
        color: 'danger',
      });
      history.push('/login');
      return;
    }

    setIsSubmitting(true);
    presentLoading({ message: 'A obter a sua localização...' });

    // 3. Capturar a localização do utilizador
    if (!navigator.geolocation) {
      dismissLoading();
      setIsSubmitting(false);
      presentToast({ message: 'Geolocalização não é suportada neste navegador.', duration: 3000, color: 'danger' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // 4. Preparar os dados para salvar no Firebase
        const novoPedido = {
          titulo: titulo,
          descricao: descricao,
          localizacao: {
            latitude: latitude,
            longitude: longitude,
          },
          userId: auth.currentUser?.uid, // Guardar o ID do utilizador que fez o pedido
          createdAt: serverTimestamp(), // Guardar a data de criação
          // --- FUNÇÃO ADICIONADA ---
          // Adiciona o status inicial para que o pedido apareça no mapa e no feed
          status: 'aberto', 
        };
        
        await presentLoading({ message: 'A enviar o seu pedido...' });
        
        // 5. Salvar o novo pedido na coleção 'pedidosDeAjuda'
        try {
          await addDoc(collection(db, "pedidosDeAjuda"), novoPedido);
          
          dismissLoading();
          presentToast({
            message: 'O seu pedido foi enviado com sucesso!',
            duration: 2000,
            color: 'success',
          });
          
          // Redireciona o utilizador para o mapa para ele ver o seu pedido
          history.push('/mapa');

        } catch (error) {
          console.error("Erro ao salvar o pedido: ", error);
          dismissLoading();
          setIsSubmitting(false);
          presentToast({ message: 'Ocorreu um erro ao enviar o seu pedido.', duration: 3000, color: 'danger' });
        }
      },
      (error) => {
        console.error("Erro de geolocalização: ", error);
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
            value={titulo}
            onIonChange={(e) => setTitulo(e.detail.value!)}
            placeholder="Ex: Preciso de uma cesta básica"
          />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Descreva o que você precisa</IonLabel>
          <IonTextarea
            value={descricao}
            onIonChange={(e) => setDescricao(e.detail.value!)}
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