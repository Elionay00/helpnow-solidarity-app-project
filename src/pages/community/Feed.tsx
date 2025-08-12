// src/pages/community/Feed.tsx - ATUALIZADO E OTIMIZADO

import React from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard,
  IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton,
  IonIcon, IonLoading, IonText, IonRefresher, IonRefresherContent,
  IonButtons, IonBackButton,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { locationOutline, helpCircleOutline, sadOutline } from 'ionicons/icons';
import { useQuery } from '@tanstack/react-query'; // Importa o hook useQuery

// Importações do Firebase
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';

import './Feed.css';

interface HelpRequest {
  id: string;
  titulo: string;
  descricao: string;
  status: 'aberto' | 'em_atendimento';
  createdAt: Timestamp;
}

function formatTimeAgo(timestamp: Timestamp): string {
  if (!timestamp) return '';
  const now = new Date();
  const postDate = timestamp.toDate();
  const seconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " anos atrás";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " meses atrás";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " dias atrás";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " horas atrás";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutos atrás";
  return Math.floor(seconds) + " segundos atrás";
}

const fetchRequests = async (): Promise<HelpRequest[]> => {
  const q = query(
    collection(db, "pedidosDeAjuda"),
    where("status", "in", ["aberto", "em_atendimento"]),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as HelpRequest[];
};

const Feed: React.FC = () => {
  const history = useHistory();

  // O hook useQuery agora gerencia a busca, o cache e o estado de loading
  const { data: requests, isLoading, refetch } = useQuery({
    queryKey: ['helpRequests'], // Chave única para identificar este cache
    queryFn: fetchRequests,   // Função que busca os dados
  });

  const handleRefresh = async (event: any) => {
    await refetch(); // O refetch do useQuery busca os dados novamente
    event.detail.complete();
  };

  const goToDetails = (id: string) => {
    history.push(`/pedido/${id}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle className="ion-text-center">Pedidos de Ajuda</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonLoading isOpen={isLoading} message={'A carregar feed...'} />

        {!isLoading && requests && requests.length === 0 && (
          <div className="ion-text-center" style={{ marginTop: '50px' }}>
            <IonIcon icon={sadOutline} style={{ fontSize: '4rem', color: '#ccc' }} />
            <IonText>
              <h3>Nenhum pedido de ajuda disponível no momento.</h3>
              <p>Volte mais tarde ou seja o primeiro a pedir ajuda!</p>
            </IonText>
          </div>
        )}

        {!isLoading && requests && requests.map((request) => (
          <IonCard key={request.id}>
            <IonCardHeader>
              <IonCardTitle className="feed-title">
                <IonIcon icon={helpCircleOutline} style={{ marginRight: 8 }} />
                {request.titulo}
              </IonCardTitle>
              <IonCardSubtitle className="feed-location">
                <IonIcon icon={locationOutline} style={{ marginRight: 6 }} />
                Pedido feito {formatTimeAgo(request.createdAt)}
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent className="feed-description">
              {request.descricao}
            </IonCardContent>
            <IonButton expand="block" color="success" onClick={() => goToDetails(request.id)}>
              Ver Detalhes e Ajudar
            </IonButton>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Feed;