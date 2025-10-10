// src/pages/MapHelp/Map.tsx
import React, { useState, useEffect, useRef } from 'react';
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
  useIonViewDidEnter,
} from '@ionic/react';
import { locateOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

// Importações do Leaflet
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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
  
  const mapRef = useRef<L.Map>(null);
  const [helpRequests, setHelpRequests] = useState<HelpRequestLocation[]>([]);
  const [accessPoints, setAccessPoints] = useState<AccessPointLocation[]>([]);
  const [loading, setLoading] = useState(true);

  const [presentToast] = useIonToast();

  useIonViewDidEnter(() => {
    // O mapa pode não estar pronto na primeira vez, mas o ref sim.
    setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 200);
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

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
        
        <MapContainer ref={mapRef} center={initialPosition} zoom={14} style={{ height: '100%', width: '100%' }}>
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