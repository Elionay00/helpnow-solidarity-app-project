import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
  useIonViewWillEnter,
  IonLoading, // ALTERADO: Trocado useIonLoading por IonLoading
  IonText,
  IonRefresher,
  IonRefresherContent,
  IonButtons,
  IonBackButton,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { locationOutline, helpCircleOutline, sadOutline } from 'ionicons/icons';

// Importações do Firebase
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';

import './Feed.css';

interface Pedido {
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

const Feed: React.FC = () => {
  const history = useHistory();
  // ALTERADO: A linha com useIonLoading foi removida
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPedidos = async (event?: any) => {
    if (!event) {
      setLoading(true);
    }
    try {
      const q = query(
        collection(db, "pedidosDeAjuda"),
        where("status", "in", ["aberto", "em_atendimento"]),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const pedidosBuscados = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Pedido[];
      
      setPedidos(pedidosBuscados);

    } catch (error) {
      console.error("Erro ao buscar pedidos: ", error);
    } finally {
      setLoading(false);
      if (event) {
        event.detail.complete();
      }
    }
  };

  useIonViewWillEnter(() => {
    fetchPedidos();
  });

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
        <IonRefresher slot="fixed" onIonRefresh={fetchPedidos}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {/* ALTERADO: A forma de chamar o IonLoading foi simplificada e corrigida */}
        <IonLoading isOpen={loading} message={'A carregar feed...'} />

        {!loading && pedidos.length === 0 && (
          <div className="ion-text-center" style={{ marginTop: '50px' }}>
            <IonIcon icon={sadOutline} style={{ fontSize: '4rem', color: '#ccc' }} />
            <IonText>
              <h3>Nenhum pedido de ajuda disponível no momento.</h3>
              <p>Volte mais tarde ou seja o primeiro a pedir ajuda!</p>
            </IonText>
          </div>
        )}

        {!loading && pedidos.length > 0 && (
          pedidos.map((pedido) => (
            <IonCard key={pedido.id}>
              <IonCardHeader>
                <IonCardTitle className="feed-title">
                  <IonIcon icon={helpCircleOutline} style={{ marginRight: 8 }} />
                  {pedido.titulo}
                </IonCardTitle>
                <IonCardSubtitle className="feed-location">
                  <IonIcon icon={locationOutline} style={{ marginRight: 6 }} />
                  Pedido feito {formatTimeAgo(pedido.createdAt)}
                </IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent className="feed-description">
                {pedido.descricao}
              </IonCardContent>
              <IonButton expand="block" color="success" onClick={() => goToDetails(pedido.id)}>
                Ver Detalhes e Ajudar
              </IonButton>
            </IonCard>
          ))
        )}
      </IonContent>
    </IonPage>
  );
};

export default Feed;