// /packages/_web/src/pages/EncontrarProfissionais/EncontrarProfissionais.tsx

import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonButtons,
  IonBackButton,
  IonAvatar,
  IonIcon
} from '@ionic/react';
import { firestore as db } from '../../firebase/firebaseConfig';
import { collection, getDocs, query } from 'firebase/firestore';
import { personCircleOutline } from 'ionicons/icons';

// Criamos um "molde" para os dados do profissional, para organizar o código
interface Profissional {
  id: string; // O ID do documento
  nome: string;
  especialidade: string;
  // Adicionaremos mais campos aqui no futuro, se precisarmos
}

const EncontrarProfissionais: React.FC = () => {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect roda este código assim que a página é carregada
  useEffect(() => {
    const fetchProfissionais = async () => {
      try {
        console.log("Buscando profissionais no Firestore...");
        // ETAPA 1: Apontamos para a "gaveta" (coleção) de profissionais
        const profissionaisCollectionRef = collection(db, "profissionais");
        const q = query(profissionaisCollectionRef); // Podemos adicionar filtros aqui no futuro

        // ETAPA 2: Pegamos todos os documentos ("fichas") de lá
        const querySnapshot = await getDocs(q);

        // ETAPA 3: Transformamos os dados para um formato que podemos usar
        const listaProfissionais = querySnapshot.docs.map(doc => ({
          id: doc.id,
          nome: doc.data().nome,
          especialidade: doc.data().especialidade,
        })) as Profissional[];
        
        console.log("Profissionais encontrados:", listaProfissionais);
        setProfissionais(listaProfissionais); // Guardamos na nossa "memória"

      } catch (error) {
        console.error("Erro ao buscar profissionais: ", error);
      } finally {
        setLoading(false); // Paramos o carregamento, com ou sem erro
      }
    };

    fetchProfissionais();
  }, []); // O [] vazio faz com que este código rode apenas uma vez

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/home" />
          </IonButtons>
          <IonTitle>Encontrar Profissionais</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        {loading ? (
          <div className="ion-text-center" style={{ marginTop: '50%' }}>
            <IonSpinner name="crescent" />
          </div>
        ) : (
          <IonList>
            {profissionais.map(profissional => (
              <IonItem key={profissional.id} button detail={true}>
                <IonAvatar slot="start">
                  <IonIcon icon={personCircleOutline} style={{ fontSize: '2rem' }} />
                </IonAvatar>
                <IonLabel>
                  <h2>{profissional.nome}</h2>
                  <p style={{ textTransform: 'capitalize' }}>{profissional.especialidade}</p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default EncontrarProfissionais;