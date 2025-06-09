// Importação dos componentes do Ionic React
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
} from '@ionic/react';

// Importação de ícones do Ionicons
import { locationOutline, helpCircleOutline } from 'ionicons/icons';

// Importação do CSS personalizado para estilização
import './Feed.css';

// Componente funcional Feed
const Feed: React.FC = () => {
  // Lista de pedidos de ajuda (dados simulados)
  const pedidos = [
    {
      id: 1,
      titulo: 'Ajuda com alimentos',
      local: 'Fortaleza - há 2 horas',
      descricao: 'Família com 3 crianças precisa de doações de alimentos básicos.',
    },
    {
      id: 2,
      titulo: 'Doação de roupas',
      local: 'São Paulo - há 1 dia',
      descricao: 'Jovem em situação de rua precisa de roupas de frio e calçados.',
    },
    {
      id: 3,
      titulo: 'Medicamentos urgentes',
      local: 'Belo Horizonte - há 3 horas',
      descricao: 'Idoso com hipertensão precisa de medicamentos controlados.',
    },
  ];

  return (
    <IonPage>
      {/* Cabeçalho da página */}
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle className="ion-text-center">Pedidos de Ajuda</IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* Conteúdo principal da página */}
      <IonContent className="ion-padding">
        {/* Mapeia e exibe cada pedido como um cartão */}
        {pedidos.map((pedido) => (
          <IonCard key={pedido.id}>
            <IonCardHeader>
              {/* Título do pedido com ícone */}
              <IonCardTitle className="feed-title">
                <IonIcon icon={helpCircleOutline} style={{ marginRight: 8 }} />
                {pedido.titulo}
              </IonCardTitle>

              {/* Localização e tempo do pedido com ícone */}
              <IonCardSubtitle className="feed-location">
                <IonIcon icon={locationOutline} style={{ marginRight: 6 }} />
                {pedido.local}
              </IonCardSubtitle>
            </IonCardHeader>

            {/* Descrição do pedido */}
            <IonCardContent className="feed-description">
              {pedido.descricao}
            </IonCardContent>

            {/* Botão de ação para ajudar */}
            <IonButton expand="block" color="success">
              Quero ajudar
            </IonButton>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Feed;
