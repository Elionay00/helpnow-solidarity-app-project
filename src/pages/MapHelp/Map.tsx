import React from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonFab, IonFabButton, IonIcon, IonCard, IonCardContent, IonSearchbar
} from '@ionic/react';
import { addOutline } from 'ionicons/icons';

// --- IMPORTAÇÕES DO MAPA REAL ---
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- CORREÇÃO DE ÍCONES DO LEAFLET ---
// (Evita que o marcador fique invisível no navegador)
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapPage: React.FC = () => {
  // Coordenadas centrais (Ex: São Paulo, mas você pode mudar para sua cidade)
  const position: [number, number] = [-23.5505, -46.6333];

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary">
          <IonTitle>Mapa de Solidariedade</IonTitle>
        </IonToolbar>
        <IonSearchbar placeholder="Buscar bairro ou cidade..." color="light"></IonSearchbar>
      </IonHeader>

      <IonContent fullscreen>
        {/* CONTAINER DO MAPA REAL */}
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <MapContainer 
            center={position} 
            zoom={13} 
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            {/* Camada das ruas (OpenStreetMap) */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Exemplo de Marcador de Alguém pedindo ajuda */}
            <Marker position={position}>
              <Popup>
                <strong>Pedido de Ajuda:</strong> <br /> 
                Preciso de doação de alimentos.
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        {/* Card Informativo Inferior (Z-Index alto para ficar por cima do mapa) */}
        <div style={{ 
          position: 'absolute', 
          bottom: '20px', 
          width: '100%', 
          zIndex: 1000 
        }}>
          <IonCard mode="ios" style={{ margin: '0 15px', borderRadius: '15px' }}>
            <IonCardContent className="ion-text-center">
              <strong>Explorando Pedidos Próximos</strong> <br />
              Toque nos marcadores para ver detalhes.
            </IonCardContent>
          </IonCard>
        </div>

        {/* Botão Flutuante para Adicionar Novo Pedido no Mapa */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed" style={{ marginBottom: '100px', marginRight: '10px', zIndex: 1001 }}>
          <IonFabButton color="danger">
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default MapPage;