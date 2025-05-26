// src/firebase/firebaseConfig.ts

// Importa as funções que você precisa do Firebase SDK
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';           // Para o serviço de Autenticação
import { getFirestore, Firestore } from 'firebase/firestore'; // Para o serviço de Banco de Dados Firestore

// Suas credenciais únicas do projeto Firebase.
// Estes valores foram copiados diretamente do seu Firebase Console para o app web HelpNow - Solidarity.
const firebaseConfig = {
  apiKey: "AIzaSyCfZRfN0N3xaAoEEJFNjG4dPlS8NqcIsYc",
  authDomain: "helpnow---solidarity.firebaseapp.com",
  projectId: "helpnow---solidarity",
  storageBucket: "helpnow---solidarity.firebasestorage.app",
  messagingSenderId: "643021457446",
  appId: "1:643021457446:web:7460c4aa7cfd6ce2a13ee7"
};

// Inicializa o aplicativo Firebase com suas credenciais
const app: FirebaseApp = initializeApp(firebaseConfig);

// Inicializa e exporta as instâncias dos serviços do Firebase que você vai usar.
// Isso permite que você importe 'auth' e 'db' diretamente em outras partes do seu código.
export const auth: Auth = getAuth(app);         // Serviço de Autenticação do Firebase
export const db: Firestore = getFirestore(app); // Serviço de Banco de Dados Firestore