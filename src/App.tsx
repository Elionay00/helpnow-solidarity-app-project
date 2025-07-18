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
// NOVO: Importa o ícone de perfil
import { homeOutline, logInOutline, personOutline, mapOutline, personCircleOutline } from 'ionicons/icons';

import Login from './Autentication/userLogin/interactionUser/LoginPresentation';
import Register from './Autentication/userRegister/interactionUser/RegisterPresentation';
import WelcomePresentation from "./pages/welcome/WelcomePresentation";
import Feed from './pages/community/Feed';
import NeedHelp from './pages/HelpRequests/needHelp';
import WantToSupport from './pages/SupportOffers/wantToSupport';
import Home from './pages/StartPage/Home';
import GoodDeedsForm from "./pages/SupportOffers/GoodDeedsForm";
import Mapa from './pages/MapHelp/Mapa';
import PedidoDetalhes from './pages/HelpRequests/PedidoDetalhes';
// NOVO: Importa a nova página de perfil
import Perfil from './pages/Profile/Perfil';


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

const App: React.FC = () => {
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserAuthenticated(!!user);
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  if (checkingAuth) {
    return null;
  }

  const isWelcomeScreen = window.location.pathname === '/welcome';

  return (
    <IonApp>
      <IonReactRouter>
        {isWelcomeScreen ? (
          <IonRouterOutlet>
            <Route exact path="/welcome" render={() => <WelcomePresentation />} />
            <Route exact path="/register" render={() => <Register />} />
            <Route exact path="/login" render={() => <Login />} />
            <Route exact path="/home" render={() => <Home />} />
            <Route exact path="/feed" render={() => <Feed />} />
            <Route exact path="/preciso-de-ajuda" render={() => <NeedHelp />} />
            <Route exact path="/quero-ajudar" render={() => <WantToSupport />} />
            <Route exact path="/GoodDeedsForm" render={() => <GoodDeedsForm />} />
            <Route exact path="/mapa" render={() => <Mapa />} />
            <Route exact path="/pedido/:id" render={() => <PedidoDetalhes />} />
            {/* NOVO: Rota para a página de perfil */}
            <Route exact path="/perfil" render={() => <Perfil />} />
            <Route exact path="/">
              <Redirect to="/welcome" />
            </Route>
          </IonRouterOutlet>
        ) : (
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/welcome" render={() => <WelcomePresentation />} />
              <Route exact path="/register" render={() => <Register />} />
              <Route exact path="/login" render={() => <Login />} />
              <Route exact path="/home" render={() => <Home />} />
              <Route exact path="/feed" render={() => <Feed />} />
              <Route exact path="/preciso-de-ajuda" render={() => <NeedHelp />} />
              <Route exact path="/quero-ajudar" render={() => <WantToSupport />} />
              <Route exact path="/GoodDeedsForm" render={() => <GoodDeedsForm />} />
              <Route exact path="/mapa" render={() => <Mapa />} />
              <Route exact path="/pedido/:id" render={() => <PedidoDetalhes />} />
              {/* NOVO: Rota para a página de perfil */}
              <Route exact path="/perfil" render={() => <Perfil />} />
              <Route exact path="/">
                <Redirect to={userAuthenticated ? "/home" : "/welcome"} />
              </Route>
            </IonRouterOutlet>

            <IonTabBar slot="bottom">
              {userAuthenticated ? (
                <>
                  <IonTabButton tab="home" href="/home">
                    <IonIcon aria-hidden="true" icon={homeOutline} />
                    <IonLabel>Início</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="mapa" href="/mapa">
                    <IonIcon aria-hidden="true" icon={mapOutline} />
                    <IonLabel>Mapa</IonLabel>
                  </IonTabButton>
                  {/* NOVO: Botão da aba de Perfil */}
                  <IonTabButton tab="perfil" href="/perfil">
                    <IonIcon aria-hidden="true" icon={personCircleOutline} />
                    <IonLabel>Perfil</IonLabel>
                  </IonTabButton>
                </>
              ) : (
                <>
                  {!userAuthenticated && (
                    <>
                      <IonTabButton tab="login" href="/login">
                        <IonIcon aria-hidden="true" icon={logInOutline} />
                        <IonLabel>Login</IonLabel>
                      </IonTabButton>
                      <IonTabButton tab="register" href="/register">
                        <IonIcon aria-hidden="true" icon={personOutline} />
                        <IonLabel>Cadastro</IonLabel>
                      </IonTabButton>
                    </>
                  )}
                </>
              )}
            </IonTabBar>
          </IonTabs>
        )}
      </IonReactRouter>
    </IonApp>
  );
};

export default App;