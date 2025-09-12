import React, { Suspense, useState, useEffect } from "react";
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonTabs,
  IonIcon,
  IonSpinner,
  IonPage,
  IonContent,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import { homeOutline, mapOutline, personCircleOutline } from "ionicons/icons";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebaseConfig";

/* CSS Imports */
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

/* Lazy Imports */
const Login = React.lazy(() => import("./Autentication/userLogin/interactionUser/LoginPresentation"));
const Register = React.lazy(() => import("./Autentication/userRegister/interactionUser/RegisterPresentation"));
const WelcomePresentation = React.lazy(() => import("./pages/welcome/WelcomePresentation"));
const Feed = React.lazy(() => import("./pages/community/Feed"));
const NeedHelp = React.lazy(() => import("./pages/HelpRequests/needHelp"));
const WantToSupport = React.lazy(() => import("./pages/SupportOffers/wantToSupport"));
const Home = React.lazy(() => import("./pages/StartPage/Home"));
const GoodDeedsForm = React.lazy(() => import("./pages/SupportOffers/GoodDeedsForm"));
const MapPage = React.lazy(() => import("./pages/MapHelp/Map"));
const RequestDetailsPage = React.lazy(() => import("./pages/HelpRequests/RequestDetails"));
const ProfilePage = React.lazy(() => import("./pages/Profile/Profile"));
const LogoutScreen = React.lazy(() => import("./Autentication/logout/LogoutScreen"));
const PremiumFeatures = React.lazy(() => import("./pages/PremiumFeatures/PremiumFeatures"));
const DoarAfiliado = React.lazy(() => import("./pages/doar-afiliado/doar-afiliado"));

setupIonicReact();

/* SplashScreen centralizado */
const SplashScreen: React.FC = () => (
  <IonPage>
    <IonContent fullscreen>
      <div
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IonSpinner name="crescent" />
      </div>
    </IonContent>
  </IonPage>
);

const AppRoutes: React.FC<{ userAuthenticated: boolean | null }> = ({ userAuthenticated }) => {
  if (userAuthenticated === null) {
    return <SplashScreen />;
  }

  return (
    <Suspense fallback={<SplashScreen />}>
      <IonRouterOutlet>
        {/* Tela inicial */}
        <Route path="/" exact>
          {userAuthenticated ? <Redirect to="/home" /> : <WelcomePresentation />}
        </Route>

        {/* Rotas públicas */}
        <Route path="/register" component={Register} exact />
        <Route path="/login" component={Login} exact />
        <Route path="/logout" component={LogoutScreen} exact />

        {/* Rotas protegidas (sem abas) */}
        <Route path="/preciso-de-ajuda" component={NeedHelp} exact />
        <Route path="/quero-ajudar" component={WantToSupport} exact />
        <Route path="/GoodDeedsForm" component={GoodDeedsForm} exact />
        <Route path="/pedido/:id" component={RequestDetailsPage} />
        <Route path="/premium-features" component={PremiumFeatures} exact />
        <Route path="/doar-afiliado" component={DoarAfiliado} exact />

        {/* Rotas das abas (se o usuário estiver autenticado) */}
        {userAuthenticated && (
          <Route path={["/home", "/mapa", "/perfil"]}>
            <IonTabs>
              <IonRouterOutlet>
                <Route path="/home" component={Home} exact />
                <Route path="/mapa" component={MapPage} exact />
                <Route path="/perfil" component={ProfilePage} exact />
              </IonRouterOutlet>
              <IonTabBar slot="bottom">
                <IonTabButton tab="home" href="/home">
                  <IonIcon icon={homeOutline} />
                  <IonLabel>Home</IonLabel>
                </IonTabButton>
                <IonTabButton tab="map" href="/mapa">
                  <IonIcon icon={mapOutline} />
                  <IonLabel>Mapa</IonLabel>
                </IonTabButton>
                <IonTabButton tab="profile" href="/perfil">
                  <IonIcon icon={personCircleOutline} />
                  <IonLabel>Perfil</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          </Route>
        )}
      </IonRouterOutlet>
    </Suspense>
  );
};

const App: React.FC = () => {
  const [userAuthenticated, setUserAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <AppRoutes userAuthenticated={userAuthenticated} />
      </IonReactRouter>
    </IonApp>
  );
};

export default App;