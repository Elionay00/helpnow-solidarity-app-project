import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonLoading,
  IonFab,
  IonFabButton,
  IonIcon,
  useIonToast,
  useIonViewWillEnter,
} from '@ionic/react';
import { locateOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

// Importações do Leaflet
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Importações do Firebase (LINHA CORRIGIDA)
import { firestore as db, auth } from "../../firebase/firebaseConfig";
import { collection, getDocs } from 'firebase/firestore';

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

interface MapControllerProps { setMapInstance: React.Dispatch<React.SetStateAction<L.Map | null>>; }

function MapController({ setMapInstance }: MapControllerProps) {
  const map = useMap();
  useEffect(() => {
    if (map) {
      setMapInstance(map);
      const timer = setTimeout(() => { map.invalidateSize(); }, 100);
      return () => clearTimeout(timer);
    }
  }, [map, setMapInstance]);
  return null;
}

// Interface para os pedidos de ajuda
interface HelpRequestLocation {
  id: string;
  name: string;
  position: L.LatLngExpression;
  status: 'aberto' | 'em_atendimento';
}

// Interface para os pontos de acesso
interface AccessPointLocation {
    id: string;
    name: string;
    address: string;
    position: L.LatLngExpression;
}

const MapPage: React.FC = () => {
  const history = useHistory();
  const initialPosition: L.LatLngExpression = [-1.295, -47.923];
  
  const [helpRequests, setHelpRequests] = useState<HelpRequestLocation[]>([]);
  const [accessPoints, setAccessPoints] = useState<AccessPointLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [presentToast] = useIonToast();

  useIonViewWillEnter(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const requestsSnapshot = await getDocs(collection(db, "pedidosDeAjuda"));
        const fetchedRequests = requestsSnapshot.docs.map(doc => {
          const data = doc.data();
          if (data.localizacao && data.status !== 'concluido') {
            return {
              id: doc.id,
              name: data.titulo,
              position: [data.localizacao.latitude, data.localizacao.longitude],
              status: data.status,
            } as HelpRequestLocation;
          }
          return null;
        }).filter((req): req is HelpRequestLocation => req !== null);
        setHelpRequests(fetchedRequests);

        const accessPointsSnapshot = await getDocs(collection(db, "pontosDeAcesso"));
        const fetchedAccessPoints = accessPointsSnapshot.docs.map(doc => {
            const data = doc.data();
            if(data.localizacao) {
                return {
                    id: doc.id,
                    name: data.nome,
                    address: data.endereco,
                    position: [data.localizacao.latitude, data.localizacao.longitude],
                } as AccessPointLocation
            }
            return null;
        }).filter((ap): ap is AccessPointLocation => ap !== null);
        setAccessPoints(fetchedAccessPoints);

      } catch (error) {
        console.error("Erro ao buscar dados do Firebase: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  });

  const findMyLocation = () => {
    if (!mapInstance) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLatLng: L.LatLngExpression = [latitude, longitude];
          mapInstance.flyTo(userLatLng, 16);
          L.marker(userLatLng, { icon: userLocationIcon }).addTo(mapInstance).bindPopup("Você está aqui!").openPopup();
        },
        (error) => {
          presentToast({ message: 'Não foi possível obter a sua localização.', duration: 3000, color: 'danger' });
        }
      );
    }
  };

  const getIconByStatus = (status: string) => {
    return status === 'em_atendimento' ? inProgressIcon : openIcon;
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Mapa de Ajuda</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonLoading isOpen={loading} message={'A carregar locais...'} />
        {!loading && (
          <MapContainer center={initialPosition} zoom={14} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {helpRequests.map(request => (
              <Marker
                key={request.id}
                position={request.position}
                icon={getIconByStatus(request.status)}
                eventHandlers={{ click: () => { history.push(`/pedido/${request.id}`); } }}
              >
                <Popup>
                  <b>{request.name}</b><br />
                  Clique para ver detalhes e ajudar.
                </Popup>
              </Marker>
            ))}

            {accessPoints.map(point => (
                <Marker
                    key={point.id}
                    position={point.position}
                    icon={accessPointIcon}
                >
                    <Popup>
                        <b>{point.name}</b><br />
                        {point.address}
                    </Popup>
                </Marker>
            ))}

            <MapController setMapInstance={setMapInstance} />
          </MapContainer>
        )}
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