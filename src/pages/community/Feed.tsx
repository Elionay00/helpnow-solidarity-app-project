import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonSpinner,
  IonButtons,
  IonBackButton,
  IonImg,
  IonChip,
  IonLabel,
} from '@ionic/react';
import { firestore } from '../../firebase/firebaseConfig';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import './Feed.css';

interface HelpRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  urgency: 'baixa' | 'media' | 'alta';
  photoURL?: string;
  requesterName: string;
  createdAt: any;
}

const Feed: React.FC = () => {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requestsCollection = collection(firestore, 'helpRequests');
        const q = query(requestsCollection, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const requestsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as HelpRequest[];
        setRequests(requestsData);
      } catch (error) {
        console.error("Erro ao buscar pedidos: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const getUrgencyColor = (urgency: string) => (urgency === 'alta' ? 'danger' : urgency === 'media' ? 'warning' : 'success');

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref="/home" /></IonButtons>
          <IonTitle>Feed da Comunidade</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {loading ? (
          <div className="spinner-container"><IonSpinner name="crescent" /></div>
        ) : (
          <IonList>
            {requests.map(request => (
              <IonCard key={request.id} className="request-card">
                {request.photoURL && <IonImg src={request.photoURL} className="card-image" />}
                <IonCardHeader>
                  <IonCardSubtitle>{request.category}</IonCardSubtitle>
                  <IonCardTitle>{request.title}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>{request.description}</p>
                  <div className="card-footer">
                    <IonChip color={getUrgencyColor(request.urgency)}><IonLabel>Urgência {request.urgency}</IonLabel></IonChip>
                    <span>por {request.requesterName}</span>
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Feed;