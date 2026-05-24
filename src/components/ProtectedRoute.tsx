import React from "react";
import { Route, Redirect } from "react-router-dom";
import { IonSpinner, IonContent, IonPage } from "@ionic/react";
import { useAuth } from "../hooks/useAuth";

interface Props {
  component: React.ComponentType<any>;
  path: string;
  exact?: boolean;
}

const ProtectedRoute: React.FC<Props> = ({ component: Component, ...rest }) => {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return (
      <IonPage>
        <IonContent className="ion-text-center ion-padding">
          <IonSpinner name="crescent" style={{ marginTop: "40vh" }} />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <Route
      {...rest}
      render={() =>
        usuario ? <Component /> : <Redirect to="/login" />
      }
    />
  );
};

export default ProtectedRoute;
