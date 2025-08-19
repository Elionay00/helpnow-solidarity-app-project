// src/App.tsx - Otimizado com Fallback Corrigido

import React, { Suspense } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp, IonRouterOutlet, setupIonicReact, IonTabBar, IonTabButton,
  IonLabel, IonTabs, IonIcon, IonSpinner,
  // Adicionar os componentes que faltavam para o Fallback
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { homeOutline, mapOutline, personCircleOutline } from 'ionicons/icons';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebaseConfig";

/* Imports de CSS */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/variables.css';

// Usando React.lazy para as páginas
const Login = React.lazy(() => import('./Autentication/userLogin/interactionUser/LoginPresentation'));
const Register = React.lazy(() => import('./Autentication/userRegister/interactionUser/RegisterPresentation'));
const WelcomePresentation = React.lazy(() => import("./pages/welcome/WelcomePresentation"));
const Feed = React.lazy(() => import('./pages/community/Feed'));
const NeedHelp = React.lazy(() => import('./pages/HelpRequests/needHelp'));
const WantToSupport = React.lazy(() => import('./pages/SupportOffers/wantToSupport'));
const Home = React.lazy(() => import('./pages/StartPage/Home'));
const GoodDeedsForm = React.lazy(() => import("./pages/SupportOffers/GoodDeedsForm"));
const MapPage = React.lazy(() => import('./pages/MapHelp/Map'));
const RequestDetailsPage = React.lazy(() => import('./pages/HelpRequests/RequestDetails'));
const ProfilePage = React.lazy(() => import('./pages/Profile/Profile'));

setupIonicReact();

// ***** A CORREÇÃO ESTÁ AQUI *****
// Adicionamos IonHeader e IonToolbar para criar uma estrutura de página válida
const LoadingFallback: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Carregando...</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent className="ion-text-center ion-padding">
      <IonSpinner />
    </IonContent>
  </IonPage>
);

const App: React.FC = () => {
  const [userAuthenticated, setUserAuthenticated] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  if (userAuthenticated === null) {
    return null;
  }

  return (
    <IonApp>
      <IonReactRouter>
        <Suspense fallback={<LoadingFallback />}>
          {userAuthenticated ? (
            <IonTabs>
              <IonRouterOutlet>
                <Route path="/home" component={Home} exact={true} />
                <Route path="/feed" component={Feed} exact={true} />
                <Route path="/preciso-de-ajuda" component={NeedHelp} exact={true} />
                <Route path="/quero-ajudar" component={WantToSupport} exact={true} />
                <Route path="/GoodDeedsForm" component={GoodDeedsForm} exact={true} />
                <Route path="/mapa" component={MapPage} exact={true} />
                <Route path="/pedido/:id" component={RequestDetailsPage} />
                <Route path="/perfil" component={ProfilePage} exact={true} />
                <Redirect from="/" to="/home" exact={true} />
              </IonRouterOutlet>
              
              <IonTabBar slot="bottom">
                <IonTabButton tab="home" href="/home">
                  <IonIcon aria-hidden="true" icon={homeOutline} />
                  <IonLabel>Início</IonLabel>
                </IonTabButton>
                <IonTabButton tab="mapa" href="/mapa">
                  <IonIcon aria-hidden="true" icon={mapOutline} />
                  <IonLabel>Mapa</IonLabel>
                </IonTabButton>
                <IonTabButton tab="perfil" href="/perfil">
                  <IonIcon aria-hidden="true" icon={personCircleOutline} />
                  <IonLabel>Perfil</IonLabel>
                </IonTabButton>
              </IonTabBar>

            </IonTabs>
          ) : (
            <IonRouterOutlet>
              <Route path="/welcome" component={WelcomePresentation} exact={true} />
              <Route path="/register" component={Register} exact={true} />
              <Route path="/login" component={Login} exact={true} />
              <Redirect from="/" to="/welcome" exact={true} />
            </IonRouterOutlet>
          )}
        </Suspense>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;