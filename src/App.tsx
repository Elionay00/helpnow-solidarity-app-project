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
import { homeOutline, logInOutline, personOutline } from 'ionicons/icons'; // Icons do Ionic


import Login from './Autentication/Login';
import Register from './Autentication/Register';
import Home from './pages/Home';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/flex-utils.css';

import './theme/variables.css';

// Configura o Ionic React
setupIonicReact();

setupIonicReact({
  mode: 'md' // força o estilo Material Design (Android)
});

const App: React.FC = () => (
  // Estrutura inicial do app 
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          {/* Rotas */}
          <Route exact path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/home" component={Home} />
          {/* Redireciona para a página inicial */}
          <Redirect exact from="/" to="/register" />
        </IonRouterOutlet>

        {/* IonTabBar é a barra de navegação das abas na parte inferior da tela */}
        <IonTabBar slot="bottom">
          <IonTabButton tab="home" href="/home">
           <IonIcon aria-hidden="true" icon={homeOutline} />
            <IonLabel>Início</IonLabel>
          </IonTabButton>

          <IonTabButton tab="login" href="/login">
          <IonIcon aria-hidden="true" icon={logInOutline}/>
            <IonLabel>Login</IonLabel>
          </IonTabButton>

          <IonTabButton tab="register" href="/register">
          <IonIcon aria-hidden="true" icon={personOutline}/>
            <IonLabel>Cadastro</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;