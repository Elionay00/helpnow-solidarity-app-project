import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect, Switch } from "react-router-dom";
import { IonSpinner, IonContent, IonPage } from "@ionic/react";

import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "./theme/variables.css";

import { useAuth } from "./hooks/useAuth";

/* Auth */
import LoginPresentation from "./auth/userLogin/interactionUser/LoginPresentation";
import RegisterPresentation from "./auth/userRegister/interactionUser/RegisterPresentation";
import ForgotPassword from "./auth/forgotPassword/interactionUser/ForgotPassword";

/* Páginas */
import Home from "./pages/StartPage/Home";
import Feed from "./pages/community/Feed";
import Map from "./pages/MapHelp/Map";
import Profile from "./pages/Profile/Profile";
import NeedHelp from "./pages/HelpRequests/needHelp";
import RequestDetails from "./pages/HelpRequests/RequestDetails";
import WantToSupport from "./pages/SupportOffers/wantToSupport";
import GoodDeedsForm from "./pages/SupportOffers/GoodDeedsForm";
import WelcomePresentation from "./pages/welcome/WelcomePresentation";
import CadastroProfissional from "./pages/CadastroProfissional/CadastroProfissional";
import EncontrarProfissionais from "./pages/CadastroProfissional/EncontrarProfissionais";

setupIonicReact();

const AppRoutes: React.FC = () => {
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
    <IonRouterOutlet>
      {/* Rotas públicas */}
      <Route exact path="/login" component={LoginPresentation} />
      <Route exact path="/register" component={RegisterPresentation} />
      <Route exact path="/forgot-password" component={ForgotPassword} />

      {/* Rotas protegidas */}
      <Route exact path="/tabs/home" render={() => usuario ? <Home /> : <Redirect to="/login" />} />
      <Route exact path="/welcome" render={() => usuario ? <WelcomePresentation /> : <Redirect to="/login" />} />
      <Route exact path="/community" render={() => usuario ? <Feed /> : <Redirect to="/login" />} />
      <Route exact path="/map" render={() => usuario ? <Map /> : <Redirect to="/login" />} />
      <Route exact path="/profile" render={() => usuario ? <Profile /> : <Redirect to="/login" />} />
      <Route exact path="/need-help" render={() => usuario ? <NeedHelp /> : <Redirect to="/login" />} />
      <Route exact path="/need-help/:id" render={() => usuario ? <RequestDetails /> : <Redirect to="/login" />} />
      <Route exact path="/support" render={() => usuario ? <WantToSupport /> : <Redirect to="/login" />} />
      <Route exact path="/support/new" render={() => usuario ? <GoodDeedsForm /> : <Redirect to="/login" />} />
      <Route exact path="/profissionais" render={() => usuario ? <EncontrarProfissionais /> : <Redirect to="/login" />} />
      <Route exact path="/profissionais/cadastro" render={() => usuario ? <CadastroProfissional /> : <Redirect to="/login" />} />

      <Route exact path="/">
        <Redirect to={usuario ? "/tabs/home" : "/login"} />
      </Route>
    </IonRouterOutlet>
  );
};

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <AppRoutes />
    </IonReactRouter>
  </IonApp>
);

export default App;
