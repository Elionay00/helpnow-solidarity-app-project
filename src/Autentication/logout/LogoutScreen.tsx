// src/pages/logout/LogoutScreen.tsx
import React from "react";
import { IonPage, IonContent, IonText, IonButton } from "@ionic/react";
import { useHistory } from "react-router-dom";

const LogoutScreen: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonContent
        fullscreen
        className="ion-padding"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <IonText>
          <h2 style={{ fontSize: "1.8rem", marginBottom: "12px" }}>👋 Você saiu com sucesso</h2>
          <p style={{ fontSize: "1.1rem", color: "#555" }}>
            Esperamos te ver novamente em breve.
          </p>
        </IonText>

        <IonButton
          expand="block"
          color="primary"
          onClick={() => history.replace("/")}
          style={{ marginTop: "24px" }}
        >
          Voltar para o início
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default LogoutScreen;
