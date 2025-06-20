import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  IonButton,
  IonText,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import helpnowLogo from "../../images/helpnow.png";

const WelcomePresentation: React.FC = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000); // 3 segundos carregando
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <IonPage>
        <IonContent fullscreen>
          <IonGrid style={{ height: "100%" }}>
            <IonRow
              className="ion-justify-content-center ion-align-items-center"
              style={{ height: "100%" }}
            >
              <IonCol size="12" sizeMd="6" sizeLg="4">
                <div
                  style={{
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                >
                  <img
                    src={helpnowLogo}
                    alt="Logo"
                    style={{ width: 100, height: 100, marginBottom: 10 }}
                  />
                  <IonSpinner name="crescent" />
                  <p style={{ margin: 0, color: "#666" }}>Carregando...</p>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonGrid style={{ height: "100%", position: "relative" }}>
          {/* Camada invisível que bloqueia cliques fora dos botões */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: "auto", // bloqueia cliques
              backgroundColor: "transparent",
              zIndex: 1,
            }}
          />
          <IonRow
            className="ion-justify-content-center ion-align-items-center"
            style={{ height: "100%", position: "relative", zIndex: 2 }}
          >
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <div style={{ textAlign: "center", padding: "0 20px" }}>
                <img
                  src={helpnowLogo}
                  alt="HelpNow Logo"
                  style={{
                    width: "140px",
                    height: "140px",
                    marginBottom: "32px",
                    objectFit: "contain",
                  }}
                />
                <IonText>
                  <h2
                    style={{
                      fontSize: "22px",
                      fontWeight: "600",
                      color: "#000",
                      marginBottom: "12px",
                    }}
                  >
                    Seja bem-vindo
                  </h2>
                  <p
                    style={{
                      fontSize: "15px",
                      color: "#555",
                      marginBottom: "32px",
                    }}
                  >
                    Conectando quem precisa com quem quer ajudar.
                  </p>
                </IonText>

                {/* Botões com pointer-events para permitir clique */}
                <IonButton
                  expand="block"
                  onClick={() => history.push("/login")}
                  style={{
                    height: "48px",
                    marginBottom: "16px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    backgroundColor: "#8A05BE",
                    color: "#fff",
                    pointerEvents: "auto",
                    position: "relative",
                    zIndex: 3,
                  }}
                >
                  Entrar
                </IonButton>

                <IonButton
                  expand="block"
                  color="danger"
                  onClick={() => history.push("/register")}
                   style={{
                    height: "48px",
                    marginBottom: "16px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    color: "#fff",
                    pointerEvents: "auto",
                    position: "relative",
                    zIndex: 3,
                    }}>
                  Criar Conta
                </IonButton>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default WelcomePresentation;
