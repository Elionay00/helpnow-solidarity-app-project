import React, { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonBadge,
  IonSpinner,
  IonButtons,
  IonBackButton,
  IonAlert,
  useIonToast,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import {
  logOutOutline,
  documentTextOutline,
  heartOutline,
  trashOutline,
  personCircleOutline,
} from "ionicons/icons";
import { usePerfilLogic } from "./usePerfilLogic";

const ProfileUser: React.FC = () => {
  const history = useHistory();
  const [presentToast] = useIonToast();
  const {
    user,
    myRequests,
    myHelps,
    loading,
    handleLogout,
    handleCancelRequest,
    getStatusColor,
  } = usePerfilLogic(presentToast);

  const [showAlert, setShowAlert] = useState<{
    isOpen: boolean;
    requestId: string | null;
  }>({ isOpen: false, requestId: null });

  const onLogout = async () => {
    await handleLogout();
    history.replace("/login");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Meu Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle className="ion-text-center">
              <IonIcon
                icon={personCircleOutline}
                style={{ fontSize: "4rem", verticalAlign: "middle" }}
              />
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {user ? (
              <IonItem lines="none" className="ion-text-center">
                <IonLabel>
                  <h2>Bem-vindo(a)!</h2>
                  <p>{user.email}</p>
                </IonLabel>
              </IonItem>
            ) : (
              <p className="ion-text-center">
                Não foi possível carregar os dados do usuário.
              </p>
            )}
            <IonButton
              expand="block"
              color="danger"
              onClick={onLogout}
              className="ion-margin-top"
            >
              <IonIcon slot="start" icon={logOutOutline} />
              Logout
            </IonButton>
          </IonCardContent>
        </IonCard>

        {/* Listas de Pedidos e Ajudas */}
        {loading ? (
          <div className="ion-text-center" style={{ marginTop: "20px" }}>
            <IonSpinner />
          </div>
        ) : (
          <>
            <IonList>
              <IonListHeader>
                <IonLabel color="primary">
                  <IonIcon icon={documentTextOutline} /> Meus Pedidos de Ajuda
                </IonLabel>
              </IonListHeader>
              {myRequests.map((order) => (
                <IonItem
                  key={order.id}
                  routerLink={`/pedido/${order.id}`}
                  detail
                >
                  <IonLabel>{order.title}</IonLabel>
                  <IonBadge color={getStatusColor(order.status)} slot="end">
                    {order.status.replace("_", " ")}
                  </IonBadge>
                  {order.status === "open" && (
                    <IonButton
                      fill="clear"
                      color="danger"
                      slot="end"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowAlert({ isOpen: true, requestId: order.id });
                      }}
                    >
                      <IonIcon icon={trashOutline} />
                    </IonButton>
                  )}
                </IonItem>
              ))}
            </IonList>

            <IonList className="ion-margin-top">
              <IonListHeader>
                <IonLabel color="primary">
                  <IonIcon icon={heartOutline} /> Ajudas que Ofereci
                </IonLabel>
              </IonListHeader>
              {myHelps.map((order) => (
                <IonItem
                  key={order.id}
                  routerLink={`/pedido/${order.id}`}
                  detail
                >
                  <IonLabel>{order.title}</IonLabel>
                  <IonBadge color={getStatusColor(order.status)} slot="end">
                    {order.status.replace("_", " ")}
                  </IonBadge>
                </IonItem>
              ))}
            </IonList>
          </>
        )}

        {/* Alerta de Confirmação */}
        <IonAlert
          isOpen={showAlert.isOpen}
          onDidDismiss={() => setShowAlert({ isOpen: false, requestId: null })}
          header="Confirmar Cancelamento"
          message="Tem a certeza que deseja cancelar este pedido?"
          buttons={[
            { text: "Não", role: "cancel" },
            {
              text: "Sim, Cancelar",
              handler: () => {
                if (showAlert.requestId) {
                  handleCancelRequest(showAlert.requestId);
                }
              },
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

// CORREÇÃO: O nome aqui deve ser o mesmo do componente definido acima
export default ProfileUser;