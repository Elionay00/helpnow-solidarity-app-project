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
} from '@ionic/react';
import { locateOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { firestore } from "../../firebase/firebaseConfig";
import { collection, getDocs, query, where } from 'firebase/firestore';

// --- Ícones Personalizados ---
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
const userLocationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});
const accessPointIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});
// --- Fim dos Ícones ---

// Interfaces de Tipo
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
  const initialPosition: L.LatLngExpression = [-1.4558, -48.5022];
  
  const [helpRequests, setHelpRequests] = useState<HelpRequestLocation[]>([]);
  const [accessPoints, setAccessPoints] = useState<AccessPointLocation[]>([]);
  const [showLoading, setShowLoading] = useState(true);
  const [presentToast] = useIonToast();
  const mapRef = useRef<L.Map>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestsQuery = query(collection(firestore, "pedidosDeAjuda"), where("localizacao", "!=", null));
        const requestsSnapshot = await getDocs(requestsQuery);
        const fetchedRequests = requestsSnapshot.docs.map(doc => { const data = doc.data(); return { id: doc.id, titulo: data.titulo || 'Pedido', position: [data.localizacao.latitude, data.localizacao.longitude], status: data.status || 'aberto' } as HelpRequestLocation; });
        setHelpRequests(fetchedRequests);

        const accessPointsQuery = query(collection(firestore, "pontosDeAcesso"), where("localizacao", "!=", null));
        const accessPointsSnapshot = await getDocs(accessPointsQuery);
        const fetchedAccessPoints = accessPointsSnapshot.docs.map(doc => { const data = doc.data(); return { id: doc.id, nome: data.nome || 'Ponto', endereco: data.endereco || '', position: [data.localizacao.latitude, data.localizacao.longitude] } as AccessPointLocation; });
        setAccessPoints(fetchedAccessPoints);
      } catch (error) {
        console.error("Erro ao buscar dados: ", error);
        presentToast({ message: 'Erro ao carregar dados do mapa.', duration: 3000, color: 'danger' });
      } finally {
        setShowLoading(false);
      }
    };
    fetchData();
  }, [presentToast]);

  const findMyLocation = () => {
    const map = mapRef.current;
    if (map) {
      map.locate({ setView: true, maxZoom: 16 });
      map.on('locationfound', (e) => {
        L.marker(e.latlng, { icon: userLocationIcon }).addTo(map)
          .bindPopup("Você está aqui!").openPopup();
      });
      map.on('locationerror', () => {
        presentToast({ message: 'Não foi possível obter sua localização.', duration: 3000, color: 'danger' });
      });
    }
  };
  
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
        <IonLoading isOpen={showLoading} message={'A carregar dados...'} />
        <MapContainer 
            center={initialPosition} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
        >
            <TileLayer 
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {helpRequests.map(request => (
              <Marker key={request.id} position={request.position} icon={getIconByStatus(request.status)} eventHandlers={{ click: () => { history.push(`/pedido/${request.id}`); } }}>
                <Popup><b>{request.titulo}</b><br />Clique para ver detalhes.</Popup>
              </Marker>
            ))}
            {accessPoints.map(point => (
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