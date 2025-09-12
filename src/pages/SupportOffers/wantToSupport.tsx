import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonText,
  IonButtons,
  IonBackButton,
  IonIcon,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { arrowBackOutline } from "ionicons/icons";

// Componente da página "Quero Ajudar"
const WantToSupport: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      {/* Cabeçalho com botão de voltar */}
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" text="">
              <IonIcon icon={arrowBackOutline} />
            </IonBackButton>
          </IonButtons>
          <IonTitle style={{ fontWeight: "bold", fontSize: "18px" }}>
            Quero ajudar
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      {/* Conteúdo principal da página */}
      <IonContent
        fullscreen
        className="ion-padding"
        style={{
          "--background": "linear-gradient(to bottom, #e0f7fa, #c8e6c9)",
        }}
      >
        {/* Container centralizado com conteúdo */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            maxWidth: "600px",
            margin: "0 auto",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          {/* Cartão com mensagem de incentivo */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "30px 25px",
              boxShadow: "0 12px 25px rgba(0,0,0,0.2)",
              color: "#222",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              width: "100%",
              marginBottom: "30px",
            }}
          >
            <IonText>
              <h2
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  marginBottom: "15px",
                  color: "#003366",
                  textAlign: "center",
                }}
              >
                💖 Seja um herói para alguém!
              </h2>
              <p
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 400,
                  color: "#444",
                  lineHeight: 1.4,
                  textAlign: "center",
                }}
              >
                Sua ajuda pode transformar vidas. Cadastre-se e veja quem
                precisa perto de você.
              </p>
            </IonText>
          </div>

          {/* Botão para acessar a lista de pedidos de ajuda */}
          <IonButton
            expand="block"
            routerLink="/feed"
            style={{
              "--background": "#00b3c6",
              "--background-activated": "#008c9e",
              "--color": "#ffffff",
              borderRadius: "12px",
              height: "55px",
              fontSize: "1.2rem",
              fontWeight: "bold",
              marginBottom: "18px",
              boxShadow: "0 8px 18px rgba(0, 179, 198, 0.4)",
              width: "100%",
              maxWidth: "300px",
            }}
          >
            Ver pedidos de ajuda
          </IonButton>

          {/* Botão para ir ao formulário de ajudar */}
          <IonButton
            expand="block"
            routerLink="/GoodDeedsForm"
            style={{
              "--background": "#00b3c6",
              "--background-activated": "#008c9e",
              "--color": "#ffffff",
              borderRadius: "12px",
              height: "55px",
              fontSize: "1.2rem",
              fontWeight: "bold",
              marginBottom: "18px",
              boxShadow: "0 8px 18px rgba(0, 179, 198, 0.4)",
              width: "100%",
              maxWidth: "300px",
            }}
          >
            Quero ajudar agora
          </IonButton>

          {/* NOVO: BOTÃO PARA A PÁGINA DE AFILIAÇÃO */}
          <IonButton
            expand="block"
            routerLink="/doar-afiliado"
            style={{
              "--background": "#28a745",
              "--background-activated": "#218838",
              "--color": "#ffffff",
              borderRadius: "12px",
              height: "55px",
              fontSize: "1.2rem",
              fontWeight: "bold",
              marginBottom: "18px",
              boxShadow: "0 8px 18px rgba(0, 0, 0, 0.2)",
              width: "100%",
              maxWidth: "300px",
            }}
          >
            Comprar e Doar
          </IonButton>

          {/* Botão para voltar à tela anterior */}
          <IonButton
            expand="block"
            fill="outline"
            onClick={() => history.goBack()}
            style={{
              "--border-color": "#003366",
              "--border-width": "2px",
              "--color": "#003366",
              "--ripple-color": "#003366",
              borderRadius: "12px",
              height: "55px",
              fontSize: "1.2rem",
              fontWeight: "bold",
              boxShadow: "0 5px 10px rgba(0,0,0,0.1)",
              width: "100%",
              maxWidth: "300px",
            }}
          >
            Voltar
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default WantToSupport;