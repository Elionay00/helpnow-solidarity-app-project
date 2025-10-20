// /packages/_web/src/pages/Feed/Feed.tsx 

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
// <-- NOVO: Importar 'where' para filtrar por status: active
import { collection, getDocs, query, orderBy, Timestamp, where } from 'firebase/firestore'; 
import './Feed.css';

// --- Interface dos Pedidos (Existente) ---
interface HelpRequest {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  urgencia: 'baixa' | 'media' | 'alta';
  photoURL?: string;
  requesterName: string;
  createdAt: Timestamp;
}

// --- <-- NOVO: Interface para os Parceiros ---
interface Partner {
  id: string;
  nome: string;
  logoUrl: string;
  siteUrl: string;
  descricao: string;
  status: 'active' | 'inactive';
}

const Feed: React.FC = () => {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]); // <-- NOVO: Estado para os parceiros
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // <-- NOVO: Mudei o nome da função para buscar tudo
    const fetchAllData = async () => {
      try {
        // --- 1. Buscar Pedidos (Código existente) ---
        const requestsCollection = collection(firestore, 'pedidosDeAjuda');
        const qReq = query(requestsCollection, orderBy('createdAt', 'desc'));
        const reqSnapshot = await getDocs(qReq);
        const requestsData = reqSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as HelpRequest[];
        setRequests(requestsData);

        // --- 2. Buscar Parceiros (Código NOVO) ---
        const partnersCollection = collection(firestore, 'parceiros');
        // Filtra para pegar apenas parceiros com status "active"
        const qPar = query(partnersCollection, where('status', '==', 'active'));
        const parSnapshot = await getDocs(qPar);
        const partnersData = parSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Partner[];
        setPartners(partnersData);

      } catch (error) {
        console.error("Erro ao buscar dados: ", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData(); // <-- NOVO: Chama a nova função
  }, []);

  const getUrgencyColor = (urgency: string) => (urgency === 'alta' ? 'danger' : urgency === 'media' ? 'warning' : 'success');

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref="/tabs/home" /></IonButtons>
          <IonTitle>Feed da Comunidade</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {loading ? (
          <div className="spinner-container"><IonSpinner name="crescent" /></div>
        ) : (
          <> 
            {/* --- SEÇÃO DE PARCEIROS CORRIGIDA --- */}
            {partners.length > 0 && (
              <div className="partners-section">
                
                {/* --- AQUI ESTÁ A CORREÇÃO --- */}
                {/* Trocamos <IonTitle> por <h2> para não quebrar o layout */}
                <h2 className="partners-title">
                  🤝 Empresas Parceiras
                </h2>
                {/* --- FIM DA CORREÇÃO --- */}

                <div className="partners-carousel"> 
                  {partners.map(partner => (
                    <a href={partner.siteUrl} key={partner.id} target="_blank" rel="noopener noreferrer" className="partner-card">
                      <IonImg src={partner.logoUrl} className="partner-logo" alt={`Logo de ${partner.nome}`} />
                      <IonLabel>{partner.nome}</IonLabel>
                    </a>
                  ))}
                </div>
              </div>
            )}
            {/* --- FIM DA SEÇÃO DE PARCEIROS --- */}


            {/* --- Seção de Pedidos (Seu código existente) --- */}
            <IonList>
              {requests.map(request => (
                <IonCard key={request.id} className="request-card" routerLink={`/pedido/${request.id}`}>
                  {request.photoURL && <IonImg src={request.photoURL} className="card-image" />}
                  <IonCardHeader>
                    <IonCardSubtitle>{request.categoria}</IonCardSubtitle>
                    <IonCardTitle>{request.titulo}</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p>{request.descricao}</p>
                    <div className="card-footer">
                      <IonChip color={getUrgencyColor(request.urgencia)}><IonLabel>Urgência {request.urgencia}</IonLabel></IonChip>
                      <span>por {request.requesterName}</span>
                    </div>
                  </IonCardContent>
                </IonCard>
              ))}
            </IonList>
          </>
        )}
      </IonContent>
    </IonPage>
  );
}
export default Feed;