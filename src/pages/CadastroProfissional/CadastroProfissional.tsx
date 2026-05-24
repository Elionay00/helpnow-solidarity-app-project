// /packages/_web/src/pages/CadastroProfissional/CadastroProfissional.tsx - VERSÃO ATUALIZADA

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
  IonBackButton,
  IonSelect,
  IonSelectOption
} from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { auth, firestore as db } from '../../firebase/firebaseConfig'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const CadastroProfissional: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const history = useHistory();

  const handleRegister = async () => {
    if (!email || !senha || !nome || !telefone || !especialidade) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    console.log('--- INICIANDO PROCESSO DE CADASTRO ---');
    
    try {
      console.log('ETAPA 1: Tentando criar usuário no Authentication...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;
      console.log('SUCESSO (Etapa 1): Usuário criado no Auth com UID:', user.uid);

      // --- LÓGICA DO FIRESTORE COM MAIS LOGS ---
      console.log('ETAPA 2: Preparando para salvar dados no Firestore...');
      const userDocRef = doc(db, "profissionais", user.uid);
      
      const dataToSave = {
        nome: nome,
        email: email,
        telefone: telefone,
        especialidade: especialidade,
        uid: user.uid,
        
        // --- ALTERAÇÃO AQUI ---
        // Adicionando os campos para controlar a assinatura
        isPremium: false,
        premiumExpiresAt: null
        // --- FIM DA ALTERAÇÃO ---
      };

      console.log('Dados a serem salvos:', dataToSave);

      await setDoc(userDocRef, dataToSave);

      console.log('SUCESSO (Etapa 2): Dados do profissional salvos no Firestore!');
      // --- FIM DA LÓGICA ---
      
      alert('Cadastro realizado com sucesso!');
      history.push('/tabs/home');

    } catch (error: any) {
      console.error('!!! ERRO CRÍTICO NO PROCESSO DE CADASTRO:', error);
      alert('Erro ao criar usuário: ' + error.message);
    }
  };

  // O resto do código (a parte visual) continua exatamente o mesmo...
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
          {/* Item Nome */}
          <IonItem>
            <IonLabel position="floating">Nome Completo</IonLabel>
            <IonInput type="text" value={nome} onIonChange={e => setNome(e.detail.value!)} />
          </IonItem>

          {/* Item Email */}
          <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput type="email" value={email} onIonChange={e => setEmail(e.detail.value!)} />
          </IonItem>

          {/* Item Senha */}
          <IonItem>
            <IonLabel position="floating">Crie uma Senha</IonLabel>
            <IonInput type="password" value={senha} onIonChange={e => setSenha(e.detail.value!)} />
          </IonItem>

          {/* Item Telefone */}
          <IonItem>
            <IonLabel position="floating">Telefone / WhatsApp</IonLabel>
            <IonInput type="tel" value={telefone} onIonChange={e => setTelefone(e.detail.value!)} />
          </IonItem>

          {/* Item Especialidade */}
          <IonItem>
            <IonLabel>Especialidade Principal</IonLabel>
            <IonSelect value={especialidade} placeholder="Selecione uma" onIonChange={e => setEspecialidade(e.detail.value)}>
              <IonSelectOption value="eletricista">Eletricista</IonSelectOption>
              <IonSelectOption value="encanador">Encanador</IonSelectOption>
              <IonSelectOption value="pintor">Pintor</IonSelectOption>
              <IonSelectOption value="diarista">Diarista</IonSelectOption>
              <IonSelectOption value="montador">Montador de Móveis</IonSelectOption>
              <IonSelectOption value="pedreiro">Pedreiro</IonSelectOption>
            </IonSelect>
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