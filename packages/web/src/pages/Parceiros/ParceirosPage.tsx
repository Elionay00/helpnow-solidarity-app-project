import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonSpinner,
  IonText,
  IonButtons,
  IonBackButton,
  IonItem
} from '@ionic/react';
import ParceiroCard from '../../components/ParceiroCard';

// --- ATENÇÃO: MUITO IMPORTANTE ---
// Substitua 'SEU_IP_LOCAL' pelo endereço IP da sua máquina na sua rede Wi-Fi.
// Exemplo: 'http://19.168.1.10:5000/api/parceiros'
// Você não pode usar 'localhost' quando for testar no seu celular.
const API_URL = 'http://192.168.0.101:5000/api/parceiros'; // Exemplo, use o seu IP!

interface Parceiro {
  _id: string;
  nome: string;
  logoUrl: string;
  descricao: string;
  siteUrl?: string;
}

const ParceirosPage: React.FC = () => {
  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParceiros = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Falha ao buscar dados do servidor.');
        }
        const data = await response.json();
        setParceiros(data);
      } catch (err: any) {
        console.error("ERRO DETALHADO:", err); // Adicionado para depuração
        setError('Não foi possível conectar ao servidor. Verifique o IP e se o backend está rodando.');
      } finally {
        setLoading(false);
      }
    };

    fetchParceiros();
  }, []); // O array vazio [] faz com que este efeito rode apenas uma vez

  const renderContent = () => {
    if (loading) {
      return <div className="ion-text-center ion-padding"><IonSpinner /></div>;
    }

    if (error) {
      return <div className="ion-text-center ion-padding"><IonText color="danger">{error}</IonText></div>;
    }
    
    if (parceiros.length === 0) {
      return <div className="ion-text-center ion-padding"><IonText>Nenhum parceiro encontrado.</IonText></div>;
    }

    return (
      <IonList>
        {parceiros.map(parceiro => (
          <IonItem key={parceiro._id} lines="none" style={{'--padding-start': 0, '--inner-padding-end': 0}}>
            <ParceiroCard parceiro={parceiro} />
          </IonItem>
        ))}
      </IonList>
    );
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/home" />
          </IonButtons>
          <IonTitle>Empresas Parceiras</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Empresas Parceiras</IonTitle>
          </IonToolbar>
        </IonHeader>
        {renderContent()}
      </IonContent>
    </IonPage>
  );
};

export default ParceirosPage;
