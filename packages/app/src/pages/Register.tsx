import React, { useState } from 'react';
import { IonContent, IonPage, IonInput, IonButton, IonItem, IonLabel, IonList } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Usuário cadastrado com sucesso!");
      
      // ESTA LINHA É A CURA PARA A TELA BRANCA:
      // Ela empurra o usuário para a página inicial após o sucesso.
      history.push('/home'); 
      
    } catch (error) {
      console.error("Erro ao cadastrar", error);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <form onSubmit={handleRegister}>
          <IonList>
            <IonItem>
              <IonLabel position="floating">Email</IonLabel>
              <IonInput type="email" value={email} onIonChange={e => setEmail(e.detail.value!)} />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Senha</IonLabel>
              <IonInput type="password" value={password} onIonChange={e => setPassword(e.detail.value!)} />
            </IonItem>
          </IonList>
          <IonButton expand="block" type="submit" className="ion-margin-top">
            Finalizar Cadastro
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Register;
