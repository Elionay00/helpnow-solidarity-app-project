import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonText, IonItem, IonLabel, IonRouterLink } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de autenticação do usuário
    console.log('Login com:', email, password);
    // history.push('/home'); // Exemplo de navegação após o login
  };

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding">
        <div style={{ maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
          <IonText>
            <h1>Bem-vindo de volta!</h1>
          </IonText>
          
          <form onSubmit={handleLogin}>
            <IonItem>
              <IonLabel position="floating">E-mail</IonLabel>
              <IonInput 
                type="email" 
                value={email}
                onIonChange={(e) => setEmail(e.detail.value!)}
                required
              />
            </IonItem>

            <IonItem className="ion-margin-top">
              <IonLabel position="floating">Senha</IonLabel>
              <IonInput 
                type="password" 
                value={password}
                onIonChange={(e) => setPassword(e.detail.value!)}
                required
              />
            </IonItem>

            <IonButton 
              expand="block" 
              type="submit" 
              className="ion-margin-top"
            >
              Entrar
            </IonButton>
          </form>

          {/* O link para a página de recuperação de senha */}
          <IonRouterLink routerLink="/forgot-password" className="ion-margin-top ion-display-block">
            Esqueceu a senha?
          </IonRouterLink>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;