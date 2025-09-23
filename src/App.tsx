// src/App.tsx

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
import { Redirect, Route, RouteProps } from "react-router-dom";
import { homeOutline, mapOutline, personCircleOutline } from "ionicons/icons";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebaseConfig";

/* --- Importações de CSS --- */
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

/* --- Lazy Imports das Páginas --- */
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

/* --- Componente de SplashScreen (Tela de Carregamento) --- */
const SplashScreen: React.FC = () => (
    <IonPage>
        <IonContent fullscreen style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <IonSpinner name="crescent" />
        </IonContent>
    </IonPage>
);

/* --- Componente de Rota Privada para proteger páginas --- */
interface PrivateRouteProps extends RouteProps {
  userAuthenticated: boolean | null;
}
const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, userAuthenticated, ...rest }) => {
  if (!Component) return null;
  return (
    <Route
      {...rest}
      render={(props) => userAuthenticated ? <Component {...props} /> : <Redirect to="/login" />}
    />
  );
};

/* --- Componente que define o Layout com as Abas de Navegação --- */
const TabsLayout: React.FC = () => (
  <IonTabs>
    {/* Este IonRouterOutlet só gerencia as páginas DAS ABAS */}
    <IonRouterOutlet>
      <Route path="/tabs/home" component={Home} exact={true} />
      <Route path="/tabs/mapa" component={MapPage} exact={true} />
      <Route path="/tabs/perfil" component={ProfilePage} exact={true} />
      <Route path="/tabs" exact={true}>
        <Redirect to="/tabs/home" />
      </Route>
    </IonRouterOutlet>

    {/* A Barra de Abas Visual */}
    <IonTabBar slot="bottom">
      <IonTabButton tab="home" href="/tabs/home">
        <IonIcon aria-hidden="true" icon={homeOutline} />
        <IonLabel>Home</IonLabel>
      </IonTabButton>
      <IonTabButton tab="map" href="/tabs/mapa">
        <IonIcon aria-hidden="true" icon={mapOutline} />
        <IonLabel>Mapa</IonLabel>
      </IonTabButton>
      <IonTabButton tab="profile" href="/tabs/perfil">
        <IonIcon aria-hidden="true" icon={personCircleOutline} />
        <IonLabel>Perfil</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

/* --- Componente Principal da Aplicação --- */
const App: React.FC = () => {
  const [userAuthenticated, setUserAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  // Mostra o SplashScreen enquanto verifica a autenticação
  if (userAuthenticated === null) {
    return <IonApp><SplashScreen /></IonApp>;
  }

  return (
    <IonApp>
      <IonReactRouter>
        <Suspense fallback={<SplashScreen />}>
          {/* Este IonRouterOutlet gerencia TODAS as páginas */}
          <IonRouterOutlet>
            {/* --- Rotas Públicas (NÃO TÊM ABAS) --- */}
            <Route path="/welcome" component={WelcomePresentation} exact />
            <Route path="/register" component={Register} exact />
            <Route path="/login" component={Login} exact />
            <Route path="/logout" component={LogoutScreen} exact />

            {/* --- Rotas Privadas de Tela Cheia (NÃO TÊM ABAS) --- */}
            <PrivateRoute path="/feed" component={Feed} userAuthenticated={userAuthenticated} exact />
            <PrivateRoute path="/preciso-de-ajuda" component={NeedHelp} userAuthenticated={userAuthenticated} exact />
            <PrivateRoute path="/quero-ajudar" component={WantToSupport} userAuthenticated={userAuthenticated} exact />
            <PrivateRoute path="/GoodDeedsForm" component={GoodDeedsForm} userAuthenticated={userAuthenticated} exact />
            <PrivateRoute path="/pedido/:id" component={RequestDetailsPage} userAuthenticated={userAuthenticated} />
            <PrivateRoute path="/premium-features" component={PremiumFeatures} userAuthenticated={userAuthenticated} exact />
            <PrivateRoute path="/doar-afiliado" component={DoarAfiliado} userAuthenticated={userAuthenticated} exact />
           
            <PrivateRoute 
              path="/tabs" 
              component={TabsLayout} 
              userAuthenticated={userAuthenticated} 
            />

            {/* --- Redirecionamento Inicial --- */}
            <Route path="/" exact>
              {userAuthenticated ? <Redirect to="/tabs/home" /> : <Redirect to="/welcome" />}
            </Route>
          </IonRouterOutlet>
        </Suspense>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;