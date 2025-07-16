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

import { db } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

// --- ÍCONES PERSONALIZADOS ---
// Ícone para pedidos ABERTOS (Vermelho)
const openIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

// Ícone para pedidos EM ATENDIMENTO (Amarelo)
const inProgressIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

// Ícone para a localização do UTILIZADOR (Azul)
const userLocationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});
// --- FIM DOS ÍCONES ---

interface MapControllerProps {
  setMapInstance: React.Dispatch<React.SetStateAction<L.Map | null>>;
}

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

interface Local {
  id: string;
  nome: string;
  descricao: string;
  posicao: L.LatLngExpression;
  status: 'aberto' | 'em_atendimento' | 'concluido';
}

const Mapa: React.FC = () => {
  const history = useHistory();
  const posicaoInicial: L.LatLngExpression = [-1.976, -48.961];
  const [locais, setLocais] = useState<Local[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [map, setMap] = useState<L.Map | null>(null);
  const [presentToast] = useIonToast();

  useIonViewWillEnter(() => {
    const buscarLocais = async () => {
      setCarregando(true);
      try {
        const querySnapshot = await getDocs(collection(db, "pedidosDeAjuda"));
        const locaisBuscados = querySnapshot.docs.map(doc => {
          const dados = doc.data();
          // Apenas pedidos que não estão concluídos aparecerão no mapa
          if (dados.localizacao && dados.status !== 'concluido') {
            return {
              id: doc.id,
              nome: dados.titulo,
              descricao: dados.descricao,
              posicao: [dados.localizacao.latitude, dados.localizacao.longitude],
              status: dados.status,
            } as Local;
          }
          return null;
        }).filter((local): local is Local => local !== null);
        setLocais(locaisBuscados);
      } catch (error) {
        console.error("Erro ao buscar locais do Firebase: ", error);
      } finally {
        setCarregando(false);
      }
    };
    buscarLocais();
  });

  const findMyLocation = () => {
    if (!map) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLatLng: L.LatLngExpression = [latitude, longitude];
          map.flyTo(userLatLng, 16);
          L.marker(userLatLng, { icon: userLocationIcon }).addTo(map).bindPopup("Você está aqui!").openPopup();
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
        <IonLoading isOpen={carregando} message={'A carregar locais...'} />
        {!carregando && (
          <MapContainer center={posicaoInicial} zoom={14} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {locais.map(local => (
              <Marker
                key={local.id}
                position={local.posicao}
                icon={getIconByStatus(local.status)}
                eventHandlers={{
                  click: () => {
                    history.push(`/pedido/${local.id}`);
                  },
                }}
              >
                <Popup>
                  <b>{local.nome}</b><br />
                  Clique para ver detalhes e ajudar.
                </Popup>
              </Marker>
            ))}
            <MapController setMapInstance={setMap} />
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

export default Mapa;