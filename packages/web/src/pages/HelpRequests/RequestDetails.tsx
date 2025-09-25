import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import { firestore, auth } from '../../firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonLoading,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButtons,
  IonBackButton,
  useIonToast,
  IonIcon,
} from '@ionic/react';
import { chatbubblesOutline } from 'ionicons/icons';
// import './OrderDetailsPage.css'; // Certifique-se de que o CSS está correto

interface Order extends DocumentData {
  id: string;
  titulo: string;
  descricao: string;
  status: 'pendente' | 'em atendimento' | 'concluido';
  autorId: string;
  ajudanteId?: string;
}

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const history = useHistory();
  const [order, setOrder] = useState<Order | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [presentToast] = useIonToast();

  useEffect(() => {
    const authUnsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    if (!orderId) {
      setLoading(false);
      presentToast({ message: 'ID do pedido não encontrado.', duration: 3000, color: 'danger' });
      history.goBack();
      return;
    }

    const docRef = doc(firestore, 'pedidosDeAjuda', orderId);
    const orderUnsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setOrder({ id: docSnap.id, ...docSnap.data() } as Order);
      } else {
        presentToast({ message: 'Pedido não encontrado.', duration: 3000, color: 'danger' });
        history.goBack();
      }
      setLoading(false);
    }, (error) => {
      console.error("Erro ao buscar pedido:", error);
      presentToast({ message: 'Erro ao carregar o pedido.', duration: 3000, color: 'danger' });
      setLoading(false);
    });

    return () => {
      authUnsubscribe();
      orderUnsubscribe();
    };
  }, [orderId, history, presentToast]);

  const handleOpenChat = () => {
    if (orderId) {
      history.push(`/chat/${orderId}`);
    }
  };

  const permissions = useMemo(() => {
    if (!user || !order) return {};
    const isOwner = order.autorId === user.uid;
    const isHelper = order.ajudanteId === user.uid;
    const isAssigned = !!order.ajudanteId;

    return {
      canAccept: !isOwner && !isAssigned && order.status === 'pendente',
      canComplete: isAssigned && (isOwner || isHelper) && order.status === 'em atendimento',
      canDelete: isOwner && order.status === 'pendente',
      canOpenChat: isAssigned && (isOwner || isHelper) && order.status === 'em atendimento',
    };
  }, [user, order]);

  const handleAcceptOrder = async () => {
            if (!orderId || !user) return;
            const orderRef = doc(firestore, 'pedidosDeAjuda', orderId);    try {
      await updateDoc(orderRef, {
        ajudanteId: user.uid,
        status: 'em atendimento'
      });
      presentToast({ message: 'Você aceitou o pedido! Obrigado por ajudar.', duration: 3000, color: 'success' });
    } catch {
      presentToast({ message: 'Erro ao aceitar o pedido.', duration: 3000, color: 'danger' });
    }
  };

  const handleCompleteOrder = async () => {
    if (!orderId) return;
    const orderRef = doc(firestore, 'pedidosDeAjuda', orderId);
    try {
      await updateDoc(orderRef, {
        status: 'concluido'
      });
      presentToast({ message: 'Pedido concluído com sucesso!', duration: 3000, color: 'success' });
    } catch {
      presentToast({ message: 'Erro ao concluir o pedido.', duration: 3000, color: 'danger' });
    }
  };

  const handleDeleteOrder = async () => {
    // ... (sua lógica de exclusão)
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/home" />
          </IonButtons>
          <IonTitle>Detalhes do Pedido</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonLoading isOpen={loading} message={'A carregar...'} />
        {order && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{order.titulo}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>{order.descricao}</p>
              <p><strong>Status:</strong> {order.status}</p>
              {order.ajudanteId && <p><strong>Ajudante:</strong> {order.ajudanteId}</p>}

              <div className="ion-padding-top">
                {permissions.canAccept && (
                  <IonButton expand="block" onClick={handleAcceptOrder}>Aceitar Pedido</IonButton>
                )}
                {permissions.canComplete && (
                  <IonButton expand="block" color="success" onClick={handleCompleteOrder}>Marcar como Concluído</IonButton>
                )}
                {permissions.canOpenChat && (
                  <IonButton expand="block" fill="outline" onClick={handleOpenChat}>
                    <IonIcon slot="start" icon={chatbubblesOutline}></IonIcon>
                    Abrir Chat
                  </IonButton>
                )}
                {permissions.canDelete && (
                  <IonButton expand="block" color="danger" onClick={handleDeleteOrder}>Apagar Pedido</IonButton>
                )}
              </div>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default OrderDetailsPage;