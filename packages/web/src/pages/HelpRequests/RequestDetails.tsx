import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonLoading,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  useIonToast,
  IonAlert,
} from "@ionic/react";
import { useParams, useHistory } from "react-router-dom";
import {
  checkmarkCircleOutline,
  closeCircleOutline,
  hourglassOutline,
  shieldCheckmarkOutline,
} from "ionicons/icons";

// Importações do Firebase
import { firestore as db, auth } from "../../firebase/firebaseConfig";
import { doc, onSnapshot, updateDoc } from "firebase/firestore"; // onSnapshot é para ouvir em tempo real

// Interface (em inglês) para a estrutura de um pedido de ajuda
interface HelpRequest {
  id: string;
  titulo: string;
  descricao: string;
  status: "aberto" | "em_atendimento" | "concluido";
  userId: string; // ID de quem pediu
  helperId?: string; // ID de quem está a ajudar (opcional)
}

const RequestDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Pega o ID do pedido a partir do URL
  const history = useHistory();
  const [presentToast] = useIonToast();

  // Variáveis de estado (em inglês)
  const [request, setRequest] = useState<HelpRequest | null>(null); // Guarda os dados do pedido
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false); // Controla a exibição do alerta de confirmação

  // useEffect com onSnapshot para buscar e ouvir as atualizações do pedido em tempo real
  useEffect(() => {
    const docRef = doc(db, "pedidosDeAjuda", id); // Referência para o documento específico

    // onSnapshot cria um "ouvinte" que é notificado sempre que o documento muda
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setRequest({ id: docSnap.id, ...docSnap.data() } as HelpRequest);
        } else {
          presentToast({
            message: "Pedido não encontrado.",
            duration: 3000,
            color: "danger",
          });
          history.goBack();
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to request:", error);
        setLoading(false);
      }
    );

    // Função de limpeza: para de ouvir quando o componente é desmontado para poupar recursos
    return () => unsubscribe();
  }, [id, history, presentToast]);

  // Função para um utilizador se voluntariar para ajudar
  const handleHelp = async () => {
    if (!auth.currentUser) {
      presentToast({
        message: "Você precisa de estar logado para ajudar.",
        duration: 3000,
        color: "warning",
      });
      history.push("/login");
      return;
    }
    if (request?.userId === auth.currentUser.uid) {
      presentToast({
        message: "Você não pode atender ao seu próprio pedido.",
        duration: 3000,
        color: "danger",
      });
      return;
    }

    // Atualiza o documento no Firebase
    const docRef = doc(db, "pedidosDeAjuda", id);
    await updateDoc(docRef, {
      status: "em_atendimento",
      helperId: auth.currentUser.uid, // Guarda o ID de quem está a ajudar
    });
    presentToast({
      message: "Obrigado! Você está a ajudar neste pedido.",
      duration: 3000,
      color: "success",
    });
  };

  // Função para marcar o pedido como concluído
  const handleComplete = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "pedidosDeAjuda", id);
      await updateDoc(docRef, {
        status: "concluido",
      });
      presentToast({
        message: "Ajuda concluída com sucesso! Obrigado.",
        duration: 3000,
        color: "success",
      });
      history.push("/mapa"); // Volta para o mapa após concluir
    } catch (error) {
      console.error("Error completing request:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentUser = auth.currentUser;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/mapa" />
          </IonButtons>
          <IonTitle>Detalhes do Pedido</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonLoading isOpen={loading} message={"A carregar..."} />
        {request && (
          <>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>{request.titulo}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p>{request.descricao}</p>
                <div
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {request.status === "aberto" && (
                    <IonIcon icon={checkmarkCircleOutline} color="success" />
                  )}
                  {request.status === "em_atendimento" && (
                    <IonIcon icon={hourglassOutline} color="warning" />
                  )}
                  {request.status === "concluido" && (
                    <IonIcon icon={shieldCheckmarkOutline} color="primary" />
                  )}
                  <span
                    style={{ marginLeft: "10px", textTransform: "capitalize" }}
                  >
                    Status: {(request.status || "").replace("_", " ")}
                  </span>
                </div>

                {/* Botão "Quero Ajudar" só aparece se o pedido estiver aberto */}
                {request.status === "aberto" && (
                  <IonButton
                    expand="block"
                    onClick={handleHelp}
                    className="ion-margin-top"
                  >
                    Eu quero ajudar!
                  </IonButton>
                )}

                {/* Botão "Marcar como Concluído" aparece para quem pediu E para quem está a ajudar */}
                {request.status === "em_atendimento" &&
                  (request.helperId === currentUser?.uid ||
                    request.userId === currentUser?.uid) && (
                    <IonButton
                      expand="block"
                      color="success"
                      onClick={() => setShowAlert(true)}
                      className="ion-margin-top"
                    >
                      <IonIcon icon={shieldCheckmarkOutline} slot="start" />
                      Marcar como Concluído
                    </IonButton>
                  )}
              </IonCardContent>
            </IonCard>

            <IonAlert
              isOpen={showAlert}
              onDidDismiss={() => setShowAlert(false)}
              header={"Confirmar Ação"}
              message={
                "Tem a certeza que deseja marcar esta ajuda como concluída?"
              }
              buttons={[
                { text: "Cancelar", role: "cancel" },
                { text: "Sim, Concluir", handler: handleComplete },
              ]}
            />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default RequestDetailsPage;
