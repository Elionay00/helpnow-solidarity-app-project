import React, { Suspense, useState, useEffect } from "react";
import {
  IonApp, IonRouterOutlet, setupIonicReact, IonTabBar,
  IonTabButton, IonLabel, IonTabs, IonIcon, IonSpinner
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect, Switch } from 'react-router-dom';
import { homeOutline, mapOutline, personCircleOutline } from "ionicons/icons";
import { onAuthStateChanged } from "firebase/auth";
import { auth as firebaseAuth } from "./firebase/firebaseConfig";

/* --- CSS Core --- */
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

/* --- Lazy Imports (Ajustados para a sua pasta real: "auth") --- */
const Login = React.lazy(() => import("./auth/userLogin/interactionUser/LoginPresentation"));
const Register = React.lazy(() => import("./auth/userRegister/interactionUser/RegisterPresentation"));
const Welcome = React.lazy(() => import("./pages/welcome/WelcomePresentation"));
const Home = React.lazy(() => import("./pages/StartPage/Home"));
const MapPage = React.lazy(() => import("./pages/MapHelp/Map"));
const ProfilePage = React.lazy(() => import("./pages/Profile/Profile"));
const Feed = React.lazy(() => import("./pages/community/Feed"));
const NeedHelp = React.lazy(() => import("./pages/HelpRequests/needHelp"));
const WantToSupport = React.lazy(() => import("./pages/SupportOffers/wantToSupport"));
const LogoutScreen = React.lazy(() => import("./auth/logout/LogoutScreen"));

setupIonicReact();

const Loading = () => (
  <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
    <IonSpinner name="crescent" />
  </div>
);

const App: React.FC = () => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    // Usando firebaseAuth para não confundir com a pasta auth
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setIsAuth(!!user);
    });
    return () => unsubscribe();
  }, []);

  if (isAuth === null) return <IonApp><Loading /></IonApp>;

  return (
    <IonApp>
      <IonReactRouter>
        <Suspense fallback={<Loading />}>
          <IonRouterOutlet>
            <Switch>
              {/* --- Rotas Públicas --- */}
              <Route path="/welcome" exact>{isAuth ? <Redirect to="/tabs/home" /> : <Welcome />}</Route>
              <Route path="/login" exact>{isAuth ? <Redirect to="/tabs/home" /> : <Login />}</Route>
              <Route path="/register" exact>{isAuth ? <Redirect to="/tabs/home" /> : <Register />}</Route>
              <Route path="/logout" component={LogoutScreen} exact />

              {/* --- Layout com Abas --- */}
              <Route path="/tabs" render={() => (
                isAuth ? (
                  <IonTabs>
                    <IonRouterOutlet>
                      <Route path="/tabs/home" component={Home} exact />
                      <Route path="/tabs/mapa" component={MapPage} exact />
                      <Route path="/tabs/perfil" component={ProfilePage} exact />
                      <Redirect exact from="/tabs" to="/tabs/home" />
                    </IonRouterOutlet>
                    
                    <IonTabBar slot="bottom">
                      <IonTabButton tab="home" href="/tabs/home">
                        <IonIcon icon={homeOutline} />
                        <IonLabel>Início</IonLabel>
                      </IonTabButton>
                      <IonTabButton tab="map" href="/tabs/mapa">
                        <IonIcon icon={mapOutline} />
                        <IonLabel>Mapa</IonLabel>
                      </IonTabButton>
                      <IonTabButton tab="profile" href="/tabs/perfil">
                        <IonIcon icon={personCircleOutline} />
                        <IonLabel>Perfil</IonLabel>
                      </IonTabButton>
                    </IonTabBar>
                  </IonTabs>
                ) : <Redirect to="/login" />
              )} />

              {/* --- Rotas Internas --- */}
              <Route path="/feed" exact>{isAuth ? <Feed /> : <Redirect to="/login" />}</Route>
              <Route path="/preciso-de-ajuda" exact>{isAuth ? <NeedHelp /> : <Redirect to="/login" />}</Route>
              <Route path="/quero-ajudar" exact>{isAuth ? <WantToSupport /> : <Redirect to="/login" />}</Route>

              {/* Redirecionamento Inicial */}
              <Route exact path="/">
                {isAuth ? <Redirect to="/tabs/home" /> : <Redirect to="/welcome" />}
              </Route>
            </Switch>
          </IonRouterOutlet>
        </Suspense>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;