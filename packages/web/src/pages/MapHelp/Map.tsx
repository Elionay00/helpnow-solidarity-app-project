// src/pages/MapHelp/Map.tsx

import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonFab,
  IonFabButton,
  IonIcon,
  useIonToast,
  IonLoading,
} from '@ionic/react';
import { locateOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

// Importações do Leaflet
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Importações do Firebase
import { firestore } from "../../firebase/firebaseConfig";
import { collection, getDocs, query, where } from 'firebase/firestore';

// --- Ícones Personalizados (sem alterações) ---
const openIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});
const inProgressIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const accessPointIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});
// --- Fim dos Ícones ---


// Componente que executa ações quando o mapa está pronto
function MapEvents({ onMapReady }: { onMapReady: (map: L.Map) => void }) {
  const map = useMap();
  useEffect(() => {
    onMapReady(map);
  }, [map, onMapReady]);
  return null;
}

interface HelpRequestLocation {
  id: string;
  titulo: string;
  position: L.LatLngExpression;
  status: 'aberto' | 'em_atendimento';
}
interface AccessPointLocation {
    id: string;
    nome: string;
    endereco: string;
    position: L.LatLngExpression;
}

const MapPage: React.FC = () => {
  const history = useHistory();
  const initialPosition: L.LatLngExpression = [-1.295, -47.923];
  
  const [helpRequests, setHelpRequests] = useState<HelpRequestLocation[]>([]);
  const [accessPoints, setAccessPoints] = useState<AccessPointLocation[]>([]);
  const [loading, setLoading] = useState(true);

  const [presentToast] = useIonToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestsQuery = query(collection(firestore, "pedidosDeAjuda"), where("localizacao", "!=", null));
        const requestsSnapshot = await getDocs(requestsQuery);
        const fetchedRequests = requestsSnapshot.docs.map(doc => {
          const data = doc.data();
          return { id: doc.id, titulo: data.titulo || 'Pedido', position: [data.localizacao.latitude, data.localizacao.longitude], status: data.status || 'aberto' } as HelpRequestLocation;
        });
        setHelpRequests(fetchedRequests);

        const accessPointsQuery = query(collection(firestore, "pontosDeAcesso"), where("localizacao", "!=", null));
        const accessPointsSnapshot = await getDocs(accessPointsQuery);
        const fetchedAccessPoints = accessPointsSnapshot.docs.map(doc => {
            const data = doc.data();
            return { id: doc.id, nome: data.nome || 'Ponto', endereco: data.endereco || '', position: [data.localizacao.latitude, data.localizacao.longitude] } as AccessPointLocation;
        });
        setAccessPoints(fetchedAccessPoints);
      } catch (error) {
        console.error("Erro ao buscar dados do Firebase: ", error);
        presentToast({ message: 'Erro ao carregar os dados do mapa.', duration: 3000, color: 'danger' });
      }
    };
    
    fetchData();
  }, [presentToast]);

  const onMapReady = (map: L.Map) => {
    // Força o redimensionamento e depois esconde o loading
    setTimeout(() => {
        map.invalidateSize();
        setLoading(false);
    }, 200); // Um pequeno delay para garantir que a renderização começou
  };

  const findMyLocation = () => { /* ...código sem alterações... */ };
  const getIconByStatus = (status: string) => status === 'em_atendimento' ? inProgressIcon : openIcon;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/home" />
          </IonButtons>
          <IonTitle>Mapa de Ajuda</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        
        <IonLoading isOpen={loading} message={'A carregar mapa...'} />
        
        {/* O MapContainer agora está sempre presente, mas escondido pelo IonLoading */}
        <MapContainer center={initialPosition} zoom={14} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {!loading && helpRequests.map(request => (
              <Marker key={request.id} position={request.position} icon={getIconByStatus(request.status)} eventHandlers={{ click: () => { history.push(`/pedido/${request.id}`); } }}>
                <Popup><b>{request.titulo}</b><br />Clique para ver detalhes.</Popup>
              </Marker>
            ))}

            {!loading && accessPoints.map(point => (
                <Marker key={point.id} position={point.position} icon={accessPointIcon}>
                    <Popup><b>{point.nome}</b><br />{point.endereco}</Popup>
                </Marker>
            ))}
            
            {/* Este componente só é ativado quando o mapa está pronto */}
            <MapEvents onMapReady={onMapReady} />
        </MapContainer>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={findMyLocation} title="Minha Localização">
            <IonIcon icon={locateOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default MapPage;