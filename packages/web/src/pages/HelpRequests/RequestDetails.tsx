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
interface HelpRequest extends DocumentData {
  id: string;
  titulo: string;
  descricao: string;
  status: 'aberto' | 'em atendimento' | 'concluido';
  requesterId: string;
  helperId?: string;
}

const RequestDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [request, setRequest] = useState<HelpRequest | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [present] = useIonToast();

  useEffect(() => {
    const authUnsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    if (!id) {
      setLoading(false);
      present({ message: 'ID do pedido não encontrado.', duration: 3000, color: 'danger' });
      history.goBack();
      return;
    }

    const docRef = doc(firestore, 'pedidosDeAjuda', id);
    const orderUnsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setRequest({ id: docSnap.id, ...docSnap.data() } as HelpRequest);
      } else {
        present({ message: 'Pedido não encontrado.', duration: 3000, color: 'danger' });
        history.goBack();
      }
      setLoading(false);
    }, (error) => {
      console.error("Erro ao buscar pedido:", error);
      present({ message: 'Erro ao carregar o pedido.', duration: 3000, color: 'danger' });
      setLoading(false);
    });

    return () => {
      authUnsubscribe();
      orderUnsubscribe();
    };
  }, [id, history, present]);

  const handleOpenChat = () => {
    if (id) {
      history.push(`/chat/${id}`);
    }
  };

  const permissions = useMemo(() => {
    if (!user || !request) return {};
    const isOwner = request.requesterId === user.uid;
    const isHelper = request.helperId === user.uid;
    const isAssigned = !!request.helperId;

    return {
      canAccept: !isOwner && !isAssigned && request.status === 'aberto',
      canComplete: isAssigned && (isOwner || isHelper) && request.status === 'em atendimento',
      canDelete: isOwner && request.status === 'aberto',
      canOpenChat: isAssigned && (isOwner || isHelper) && request.status === 'em atendimento',
    };
  }, [user, request]);

  const handleAcceptOrder = async () => {
    if (!id || !user) return;
    const orderRef = doc(firestore, 'pedidosDeAjuda', id);
    try {
      await updateDoc(orderRef, {
        helperId: user.uid,
        status: 'em atendimento'
      });
      present({ message: 'Você aceitou o pedido! Obrigado por ajudar.', duration: 3000, color: 'success' });
    } catch (error) {
      console.error("Erro ao aceitar pedido:", error);
      present({ message: 'Erro ao aceitar o pedido.', duration: 3000, color: 'danger' });
    }
  };

  const handleCompleteOrder = async () => {
    if (!id) return;
    const orderRef = doc(firestore, 'pedidosDeAjuda', id);
    try {
      await updateDoc(orderRef, {
        status: 'concluido'
      });
      present({ message: 'Pedido concluído com sucesso!', duration: 3000, color: 'success' });
    } catch (error) {
      console.error("Erro ao concluir pedido:", error);
      present({ message: 'Erro ao concluir o pedido.', duration: 3000, color: 'danger' });
    }
  };

  const handleDeleteRequest = async () => {
    // A lógica de exclusão real (deleteDoc) pode ser adicionada aqui.
    // Por segurança, pode ser melhor apenas "cancelar" o pedido.
    if (!id) return;
    const orderRef = doc(firestore, 'pedidosDeAjuda', id);
    await updateDoc(orderRef, { status: 'cancelado' });
    present({ message: 'Pedido cancelado.', duration: 2000, color: 'medium' });
    history.goBack();
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
        {request && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{request.titulo}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>{request.descricao}</p>
              <p><strong>Status:</strong> {request.status}</p>
              {request.helperId && <p><strong>Ajudante:</strong> {request.helperId}</p>}

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
                  <IonButton expand="block" color="danger" onClick={handleDeleteRequest}>Apagar Pedido</IonButton>
                )}
              </div>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default RequestDetailsPage;