import {
  IonPage, IonContent, IonInput, IonButton,
  IonText, IonItem, IonLabel, IonRouterLink, IonIcon
} from '@ionic/react';
import { useLoginLogic } from '../logicLayer/LoginLogic';
import { eye, eyeOff, mailOutline, lockClosedOutline } from 'ionicons/icons';

// Estilos como objetos para melhor organização
const styles = {
  title: {
    fontSize: '2em',
    fontWeight: '700',
    marginBottom: '2em',
    marginTop: '1em',
    color: 'var(--app-text-dark)'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: 'var(--app-text-dark)',
    fontSize: '1em'
  },
  forgotPasswordLink: {
    fontSize: '0.9em',
    color: 'var(--app-text-light)',
    textDecoration: 'none'
  },
  loginButton: {
    '--background': 'var(--app-primary-color)',
    '--border-radius': '8px',
    '--box-shadow': 'none',
    height: '50px',
    fontSize: '1.1em',
    fontWeight: '500',
    textTransform: 'none' as const,
  },
  createAccountLink: {
    color: 'var(--app-text-light)',
    textDecoration: 'none'
  },
  createAccountHighlight: {
    color: 'var(--app-primary-color)',
    fontWeight: '700'
  }
};

const LoginPresentation = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleLogin,
    showPassword,
    toggleShowPassword,
  } = useLoginLogic();

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding">
        <div style={{ maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>

          <IonText>
            <h1 style={styles.title}>Faça seu login</h1>
          </IonText>

          <form onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}>

            <IonLabel className="ion-text-start" style={styles.label}>E-mail</IonLabel>
            <IonItem lines="none" className="custom-input-item">
              <IonIcon icon={mailOutline} slot="start" />
              <IonInput
                type="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onIonChange={(e) => setEmail(e.detail.value!)}
                required
              />
            </IonItem>

            <IonLabel className="ion-text-start ion-margin-top" style={styles.label}>Senha</IonLabel>
            <IonItem lines="none" className="custom-input-item">
              <IonIcon icon={lockClosedOutline} slot="start" />
              <IonInput
                type={showPassword ? 'text' : 'password'}
                placeholder="sua senha"
                value={password}
                onIonChange={(e) => setPassword(e.detail.value!)}
                required
              />
              <IonButton fill="clear" onClick={toggleShowPassword} slot="end" className="password-toggle-button">
                <IonIcon icon={showPassword ? eyeOff : eye} slot="icon-only" />
              </IonButton>
            </IonItem>

            {error && <IonText color="danger"><p style={{ textAlign: 'start', margin: '10px 0 0 0' }}>{error}</p></IonText>}

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '10px', marginBottom: '30px' }}>
              <IonRouterLink routerLink="/forgot-password" style={styles.forgotPasswordLink}>
                Esqueci minha senha
              </IonRouterLink>
            </div>

            <IonButton expand="block" type="submit" disabled={loading} style={styles.loginButton}>
              {loading ? 'Entrando...' : 'Entrar'}
            </IonButton>
          </form>

          <IonRouterLink routerLink="/register" className="ion-margin-top ion-display-block" style={styles.createAccountLink}>
            Não tem conta ainda? <span style={styles.createAccountHighlight}>Crie agora</span>
          </IonRouterLink>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginPresentation;