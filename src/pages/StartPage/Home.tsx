import React from "react";
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle,
  IonCardContent, IonButton, IonIcon, IonGrid, IonRow,
  IonCol, IonText
} from "@ionic/react";
import { helpCircle, heart, people, map } from "ionicons/icons";
import { useHistory } from "react-router-dom";

const Home: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary">
          <IonTitle>AjudaJa</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <div style={{ textAlign: "center", marginBottom: "20px", marginTop: "10px" }}>
          <IonText color="dark">
            <h1 style={{ fontWeight: "bold" }}>Ola! O que vamos fazer hoje?</h1>
          </IonText>
          <p style={{ color: "#666" }}>Transforme o dia de alguem com um pequeno gesto.</p>
        </div>

        <IonGrid>
          <IonRow>

            {/* CARD: PRECISO DE AJUDA */}
            <IonCol size="12">
              <IonCard mode="ios" style={{ borderLeft: "5px solid #eb445a" }}>
                <IonCardHeader>
                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <IonIcon icon={helpCircle} style={{ fontSize: "35px" }} color="danger" />
                    <div>
                      <IonCardTitle>Preciso de Ajuda</IonCardTitle>
                      <IonCardSubtitle>Criar novo pedido</IonCardSubtitle>
                    </div>
                  </div>
                </IonCardHeader>
                <IonCardContent>
                  Esta passando por uma dificuldade? Publique seu pedido para que a comunidade possa te encontrar.
                </IonCardContent>
                <div className="ion-padding">
                  <IonButton expand="block" color="danger" shape="round" onClick={() => history.push("/need-help")}>
                    Pedir Ajuda Agora
                  </IonButton>
                </div>
              </IonCard>
            </IonCol>

            {/* CARD: QUERO AJUDAR */}
            <IonCol size="12">
              <IonCard mode="ios" style={{ borderLeft: "5px solid #2dd36f" }}>
                <IonCardHeader>
                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <IonIcon icon={heart} style={{ fontSize: "35px" }} color="success" />
                    <div>
                      <IonCardTitle>Quero Ajudar</IonCardTitle>
                      <IonCardSubtitle>Ver quem precisa</IonCardSubtitle>
                    </div>
                  </div>
                </IonCardHeader>
                <IonCardContent>
                  Veja quem esta precisando de apoio por perto e ofereaa sua mão amiga.
                </IonCardContent>
                <div className="ion-padding">
                  <IonButton expand="block" color="success" shape="round" onClick={() => history.push("/support")}>
                    Explorar Pedidos
                  </IonButton>
                </div>
              </IonCard>
            </IonCol>

            {/* ATALHOS */}
            <IonCol size="6">
              <IonCard mode="ios" className="ion-text-center" onClick={() => history.push("/community")}>
                <IonCardContent>
                  <IonIcon icon={people} style={{ fontSize: "28px" }} color="primary" />
                  <p style={{ marginTop: "5px" }}>Comunidade</p>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="6">
              <IonCard mode="ios" className="ion-text-center" onClick={() => history.push("/map")}>
                <IonCardContent>
                  <IonIcon icon={map} style={{ fontSize: "28px" }} color="tertiary" />
                  <p style={{ marginTop: "5px" }}>Mapa</p>
                </IonCardContent>
              </IonCard>
            </IonCol>

          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
