// /packages/_web/src/pages/CadastroProfissional/CadastroProfissional.tsx - VERSÃO FINAL COM FIREBASE

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonButtons,
  IonBackButton
} from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; // Para redirecionar o usuário
import { auth } from '../../firebase/firebaseConfig'; // A nossa conexão com o Firebase
import { createUserWithEmailAndPassword } from 'firebase/auth'; // A função de criar usuário

const CadastroProfissional: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const history = useHistory(); // Preparamos o redirecionador

  const handleRegister = async () => {
    console.log('Tentando registrar com:', { nome, email, senha });

    // Verificação simples para não enviar dados vazios
    if (!email || !senha || !nome) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    try {
      // A MÁGICA ACONTECE AQUI!
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      
      // Se chegou aqui, o usuário foi criado com sucesso!
      console.log('Usuário criado com sucesso!', userCredential.user);
      alert('Cadastro realizado com sucesso!');

      // Redireciona o usuário para a página principal
      history.push('/tabs/home');

    } catch (error: any) {
      // Se deu algum erro (email já existe, senha fraca, etc.)
      console.error('Erro ao criar usuário:', error);
      alert('Erro ao criar usuário: ' + error.message);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/home" />
          </IonButtons>
          <IonTitle>Cadastro de Profissional</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        
        <IonList>
          <IonItem>
            <IonLabel position="floating">Nome Completo</IonLabel>
            <IonInput 
              type="text" 
              placeholder="Digite seu nome completo"
              value={nome}
              onIonChange={e => setNome(e.detail.value!)}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput 
              type="email" 
              placeholder="seu@email.com"
              value={email}
              onIonChange={e => setEmail(e.detail.value!)}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Crie uma Senha</IonLabel>
            <IonInput 
              type="password" 
              placeholder="Mínimo 6 caracteres"
              value={senha}
              onIonChange={e => setSenha(e.detail.value!)}
            />
          </IonItem>
        </IonList>

        <IonButton expand="block" style={{ marginTop: '20px' }} onClick={handleRegister}>
          Finalizar Cadastro
        </IonButton>

      </IonContent>
    </IonPage>
  );
};

export default CadastroProfissional;