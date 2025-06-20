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
import { homeOutline, logInOutline, personOutline } from 'ionicons/icons';

import Login from './Autentication/userLogin/interactionUser/LoginPresentation';
import Register from './Autentication/userRegister/interactionUser/RegisterPresentation';
import WelcomePresentation from "./pages/welcome/WelcomePresentation";
import Feed from './pages/community/Feed';
import NeedHelp from './pages/HelpRequests/needHelp';
import wantToSupport from './pages/SupportOffers/wantToSupport';
import Home from './pages/StartPage/Home';
import GoodDeedsForm from "./pages/SupportOffers/GoodDeedsForm";

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebaseConfig";

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
    return null; // ou um spinner de carregamento
  }

  // Verifica se o caminho atual é a tela de boas-vindas
  // Isso nos permite renderizar a estrutura de roteamento de forma diferente
  const isWelcomeScreen = window.location.pathname === '/welcome';

  return (
    <IonApp>
      <IonReactRouter>
        {/*
          Renderiza a estrutura principal com IonTabs OU apenas o IonRouterOutlet.
          Se for a tela de boas-vindas, as abas são omitidas.
          Em todas as outras telas, as abas são incluídas.
        */}
        {isWelcomeScreen ? (
          // Se estiver na tela de boas-vindas, renderiza SOMENTE o IonRouterOutlet
          // sem nenhum IonTabs ou IonTabBar.
          <IonRouterOutlet>
            <Route exact path="/welcome" component={WelcomePresentation} />
            {/*
              É importante ter todas as rotas aqui também, mesmo que não sejam
              a rota principal quando as abas não estão visíveis. Isso garante
              que a navegação funcione corretamente de /welcome para outras páginas,
              e que essas outras páginas carreguem a estrutura de abas.
            */}
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/feed" component={Feed} />
            <Route exact path="/preciso-de-ajuda" component={NeedHelp} />
            <Route exact path="/quero-ajudar" component={wantToSupport} />
            <Route exact path="/GoodDeedsForm" component={GoodDeedsForm} />
            <Route exact path="/">
              <Redirect to="/welcome" />
            </Route>
          </IonRouterOutlet>
        ) : (
          // Se NÃO estiver na tela de boas-vindas, renderiza IonTabs com IonRouterOutlet e IonTabBar.
          <IonTabs>
            <IonRouterOutlet>
              {/* Todas as suas rotas precisam estar dentro deste IonRouterOutlet principal também */}
              <Route exact path="/welcome" component={WelcomePresentation} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/home" component={Home} />
              <Route exact path="/feed" component={Feed} />
              <Route exact path="/preciso-de-ajuda" component={NeedHelp} />
              <Route exact path="/quero-ajudar" component={wantToSupport} />
              <Route exact path="/GoodDeedsForm" component={GoodDeedsForm} />
              <Route exact path="/">
                <Redirect to="/welcome" />
              </Route>
            </IonRouterOutlet>

            <IonTabBar slot="bottom">
              {userAuthenticated ? (
                <IonTabButton tab="home" href="/home">
                  <IonIcon aria-hidden="true" icon={homeOutline} />
                  <IonLabel>Início</IonLabel>
                </IonTabButton>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px 0',
                    color: 'var(--ion-color-step-400)', // cinza desabilitado
                    cursor: 'not-allowed',
                    userSelect: 'none',
                    width: '33.33%', // largura padrão dos botões na tab
                  }}
                  aria-disabled="true"
                  tabIndex={-1}
                >
                  <IonIcon aria-hidden="true" icon={homeOutline} style={{ opacity: 0.4 }} />
                  <IonLabel style={{ opacity: 0.4 }}>Início</IonLabel>
                </div>
              )}

              <IonTabButton tab="login" href="/login">
                <IonIcon aria-hidden="true" icon={logInOutline} />
                <IonLabel>Login</IonLabel>
              </IonTabButton>

              <IonTabButton tab="register" href="/register">
                <IonIcon aria-hidden="true" icon={personOutline} />
                <IonLabel>Cadastro</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        )}
      </IonReactRouter>
    </IonApp>
  );
};

export default App;