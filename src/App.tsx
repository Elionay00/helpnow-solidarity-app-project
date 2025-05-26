// src/App.tsx

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
  // Importe IonPage, IonContent, IonText se você for usar PrivateRoute de carregamento ou mensagens
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
// Ícones para as tabs
import { homeOutline, logInOutline, personOutline } from 'ionicons/icons';

// Importe seus componentes
import Login from './Autentication/Login';
import Register from './Autentication/Register';
import Home from './pages/Home'; // Caminho para Home em src/pages/


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css'; // Opcional, mas estava no seu original
import '@ionic/react/css/text-alignment.css'; // Opcional
import '@ionic/react/css/text-transformation.css'; // Opcional
import '@ionic/react/css/flex-utils.css'; // Opcional
import '@ionic/react/css/display.css'; // Opcional

/* Theme variables */
import './theme/variables.css';

// Configura o Ionic React
setupIonicReact();

// Removendo o setupIonicReact({ mode: 'md' }) duplicado, pois já foi chamado acima.
// Se quiser forçar o Material Design, mantenha um e remova o outro.
// setupIonicReact({ mode: 'md' });

const App: React.FC = () => (
  // Estrutura inicial do app
  <IonApp>
    <IonReactRouter>
      {/*
        O IonTabs deve envolver o IonRouterOutlet e o IonTabBar.
        Isso faz com que as rotas dentro deste IonRouterOutlet sejam as "páginas" das tabs.
      */}
      <IonTabs>
        <IonRouterOutlet>
          {/*
            Rotas para as páginas que serão exibidas dentro das tabs.
            É crucial que cada rota esteja associada a um componente de página completo.
          */}
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/home" component={Home} />

          {/* Redirecionamento padrão: se ninguém acessar uma rota específica, vá para /register */}
          <Redirect exact from="/" to="/register" />

          <Route>
            <Redirect to="/register" />
          </Route>
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="home" href="/home">
            <IonIcon aria-hidden="true" icon={homeOutline} />
            <IonLabel>Início</IonLabel>
          </IonTabButton>

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
    </IonReactRouter>
  </IonApp>
);

export default App;