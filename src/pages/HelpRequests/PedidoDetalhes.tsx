import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonLoading,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  useIonToast,
  IonAlert,
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { checkmarkCircleOutline, closeCircleOutline, hourglassOutline, shieldCheckmarkOutline } from 'ionicons/icons';

// Importações do Firebase
import { db, auth } from '../../firebase/firebaseConfig';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';

interface Pedido {
  id: string;
  titulo: string;
  descricao: string;
  status: 'aberto' | 'em_atendimento' | 'concluido';
  userId: string; // ID de quem pediu ajuda
  helperId?: string; // ID de quem está a ajudar
}

const PedidoDetalhes: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [presentToast] = useIonToast();

  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const docRef = doc(db, 'pedidosDeAjuda', id);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setPedido({ id: docSnap.id, ...docSnap.data() } as Pedido);
      } else {
        presentToast({ message: 'Pedido não encontrado.', duration: 3000, color: 'danger' });
        history.goBack();
      }
      setLoading(false);
    }, (error) => {
      console.error("Erro ao ouvir o pedido:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id, history, presentToast]);

  const handleHelp = async () => {
    if (!auth.currentUser) {
      presentToast({ message: 'Você precisa de estar logado para ajudar.', duration: 3000, color: 'warning' });
      history.push('/login');
      return;
    }
    if (pedido?.userId === auth.currentUser.uid) {
      presentToast({ message: 'Você não pode atender ao seu próprio pedido.', duration: 3000, color: 'danger' });
      return;
    }
    
    const docRef = doc(db, 'pedidosDeAjuda', id);
    await updateDoc(docRef, {
      status: 'em_atendimento',
      helperId: auth.currentUser.uid,
    });
    presentToast({ message: 'Obrigado! Você está a ajudar neste pedido.', duration: 3000, color: 'success' });
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'pedidosDeAjuda', id);
      await updateDoc(docRef, {
        status: 'concluido',
      });
      presentToast({ message: 'Ajuda concluída com sucesso! Obrigado.', duration: 3000, color: 'success' });
      history.push('/mapa');
    } catch (error) {
      console.error("Erro ao concluir pedido:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentUser = auth.currentUser;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/mapa" />
          </IonButtons>
          <IonTitle>Detalhes do Pedido</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonLoading isOpen={loading} message={'A carregar...'} />
        {pedido && (
          <>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>{pedido.titulo}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p>{pedido.descricao}</p>
                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
                  {pedido.status === 'aberto' && <IonIcon icon={checkmarkCircleOutline} color="success" />}
                  {pedido.status === 'em_atendimento' && <IonIcon icon={hourglassOutline} color="warning" />}
                  {pedido.status === 'concluido' && <IonIcon icon={shieldCheckmarkOutline} color="primary" />}
                  <span style={{ marginLeft: '10px', textTransform: 'capitalize' }}>Status: {(pedido.status || '').replace('_', ' ')}</span>
                </div>
                
                {pedido.status === 'aberto' && (
                  <IonButton expand="block" onClick={handleHelp} className="ion-margin-top">
                    Eu quero ajudar!
                  </IonButton>
                )}

                {/* ALTERADO: Botão "Marcar como Concluído" agora é visível para ambas as partes */}
                {/* Aparece se o pedido está 'em_atendimento' E se o utilizador atual é quem pediu OU quem está a ajudar */}
                {pedido.status === 'em_atendimento' && (pedido.helperId === currentUser?.uid || pedido.userId === currentUser?.uid) && (
                  <IonButton expand="block" color="success" onClick={() => setShowAlert(true)} className="ion-margin-top">
                    <IonIcon icon={shieldCheckmarkOutline} slot="start" />
                    Marcar como Concluído
                  </IonButton>
                )}
              </IonCardContent>
            </IonCard>

            <IonAlert
              isOpen={showAlert}
              onDidDismiss={() => setShowAlert(false)}
              header={'Confirmar Ação'}
              message={'Tem a certeza que deseja marcar esta ajuda como concluída?'}
              buttons={[
                { text: 'Cancelar', role: 'cancel' },
                { text: 'Sim, Concluir', handler: handleComplete }
              ]}
            />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default PedidoDetalhes;