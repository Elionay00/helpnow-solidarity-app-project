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
  IonLoading,
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

// Interface (em inglês) para a estrutura de um pedido de ajuda
interface HelpRequest {
  id: string;
  titulo: string;
  descricao: string;
  status: 'aberto' | 'em_atendimento';
  createdAt: Timestamp;
}

// Função utilitária para formatar o tempo (ex: "há 2 horas")
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
  
  // Variáveis de estado (em inglês)
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Função (em inglês) para buscar os pedidos do Firebase
  const fetchRequests = async (event?: any) => {
    // Só mostra o ecrã de loading grande na primeira vez que a página carrega
    if (!event) {
      setLoading(true);
    }
    try {
      // Cria uma consulta (query) ao Firebase
      const q = query(
        collection(db, "pedidosDeAjuda"),
        // Filtra para mostrar apenas pedidos com status "aberto" ou "em_atendimento"
        where("status", "in", ["aberto", "em_atendimento"]),
        // Ordena os resultados para mostrar os mais recentes primeiro
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const fetchedRequests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as HelpRequest[];
      
      setRequests(fetchedRequests); // Atualiza o estado com os pedidos encontrados

    } catch (error) {
      console.error("Error fetching requests: ", error);
    } finally {
      setLoading(false);
      // Se a função foi chamada pelo "puxar para atualizar", completa a animação
      if (event) {
        event.detail.complete();
      }
    }
  };

  // Hook do Ionic para executar a busca sempre que a página é exibida
  useIonViewWillEnter(() => {
    fetchRequests();
  });

  // Função para navegar para a página de detalhes de um pedido
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
        {/* Componente que permite "puxar para atualizar" a lista */}
        <IonRefresher slot="fixed" onIonRefresh={fetchRequests}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonLoading isOpen={loading} message={'A carregar feed...'} />

        {/* Mensagem exibida se, após carregar, não houver nenhum pedido */}
        {!loading && requests.length === 0 && (
          <div className="ion-text-center" style={{ marginTop: '50px' }}>
            <IonIcon icon={sadOutline} style={{ fontSize: '4rem', color: '#ccc' }} />
            <IonText>
              <h3>Nenhum pedido de ajuda disponível no momento.</h3>
              <p>Volte mais tarde ou seja o primeiro a pedir ajuda!</p>
            </IonText>
          </div>
        )}

        {/* A lista de pedidos só é renderizada se não estiver a carregar e se houver pedidos */}
        {!loading && requests.length > 0 && (
          requests.map((request) => (
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
          ))
        )}
      </IonContent>
    </IonPage>
  );
};

export default Feed;
