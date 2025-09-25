import React, { useState, useEffect } from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonText
} from '@ionic/react';
import { starOutline } from 'ionicons/icons';
import { doc, getDoc } from 'firebase/firestore';
import { firestore as db, auth } from '../../firebase/firebaseConfig';
import './UserReputationCard.css';

const UserReputationCard: React.FC = () => {
  const [reputationPoints, setReputationPoints] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReputation = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }
      try {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.reputationPoints) {
            setReputationPoints(userData.reputationPoints);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar a reputação:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReputation();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <IonCard className="reputation-card">
      <IonCardHeader>
        <IonCardTitle className="ion-text-center">
          <IonIcon icon={starOutline} color="warning" />
          <IonText color="dark">
            Pontos de Reputação
          </IonText>
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent className="ion-text-center">
        <h2>
          {reputationPoints}
        </h2>
        <p>Pontos de reputação por suas boas ações!</p>
      </IonCardContent>
    </IonCard>
  );
};

export default UserReputationCard;