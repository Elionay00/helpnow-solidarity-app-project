import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonTabs,
  IonIcon,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { homeOutline, mapOutline, personCircleOutline } from 'ionicons/icons';

// Importações com os novos nomes de ficheiro e de componente
import Login from './Autentication/userLogin/interactionUser/LoginPresentation';
import Register from './Autentication/userRegister/interactionUser/RegisterPresentation';
import WelcomePresentation from "./pages/welcome/WelcomePresentation";
import Feed from './pages/community/Feed';
import NeedHelp from './pages/HelpRequests/needHelp';
import WantToSupport from './pages/SupportOffers/wantToSupport';
import Home from './pages/StartPage/Home';
import GoodDeedsForm from "./pages/SupportOffers/GoodDeedsForm";
import MapPage from './pages/MapHelp/Map';
import RequestDetailsPage from './pages/HelpRequests/RequestDetails';
import ProfilePage from './pages/Profile/Profile';

import React, { useState, useEffect } from 'react';
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

setupIonicReact();

// Componente que contém as páginas para um utilizador AUTENTICADO
const AuthenticatedRoutes: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Route exact path="/home" render={() => <Home />} />
      <Route exact path="/feed" render={() => <Feed />} />
      <Route exact path="/preciso-de-ajuda" render={() => <NeedHelp />} />
      <Route exact path="/quero-ajudar" render={() => <WantToSupport />} />
      <Route exact path="/GoodDeedsForm" render={() => <GoodDeedsForm />} />
      <Route exact path="/mapa" render={() => <MapPage />} />
      <Route exact path="/pedido/:id" render={() => <RequestDetailsPage />} />
      <Route exact path="/perfil" render={() => <ProfilePage />} />
      {/* Redireciona para /home se nenhuma outra rota corresponder */}
      <Redirect to="/home" />
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
);

// Componente que contém as páginas para um utilizador NÃO AUTENTICADO
const UnauthenticatedRoutes: React.FC = () => (
  <IonRouterOutlet>
    <Route exact path="/welcome" render={() => <WelcomePresentation />} />
    <Route exact path="/register" render={() => <Register />} />
    <Route exact path="/login" render={() => <Login />} />
    {/* Redireciona para /welcome se nenhuma outra rota corresponder */}
    <Redirect to="/welcome" />
  </IonRouterOutlet>
);

const App: React.FC = () => {
  const [userAuthenticated, setUserAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Ouve as mudanças no estado de autenticação
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserAuthenticated(!!user);
    });
    return () => unsubscribe(); // Limpa o ouvinte ao desmontar
  }, []);

  // Mostra um ecrã em branco (ou um spinner) enquanto o estado de autenticação é verificado
  if (userAuthenticated === null) {
    return null;
  }

  return (
    <IonApp>
      <IonReactRouter>
        {/* Renderiza um conjunto de rotas ou o outro com base na autenticação */}
        {userAuthenticated ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />}
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
