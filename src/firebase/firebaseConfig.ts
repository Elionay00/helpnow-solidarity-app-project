// src/firebase/firebaseConfig.ts
// Importa as funções que você precisa do Firebase SDK
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';           // Para o serviço de Autenticação
import { getFirestore, Firestore } from 'firebase/firestore'; // Para o serviço de Banco de Dados Firestore

// Suas credenciais únicas do projeto Firebase.
// Estes valores foram copiados diretamente do seu Firebase Console para o app web HelpNow - Solidarity.
const firebaseConfig = {apiKey: "AIzaSyDFqkEMxBJh4dWz6CPqBZQ1WphzfhCJ1QI",
  authDomain: "ajudaja-8d5b6.firebaseapp.com",
  projectId: "ajudaja-8d5b6",
  storageBucket: "ajudaja-8d5b6.firebasestorage.app",
  messagingSenderId: "277310269351",
  appId: "1:277310269351:web:4a6c9a9a37aa3d21bbb882",
  measurementId: "G-CBCT4D4FFY"
 
};

// Inicializa o aplicativo Firebase com suas credenciais
const app: FirebaseApp = initializeApp(firebaseConfig);

// Inicializa e exporta as instâncias dos serviços do Firebase que você vai usar.
// Isso permite que você importe 'auth' e 'db' diretamente em outras partes do seu código.
export const auth: Auth = getAuth(app);         // Serviço de Autenticação do Firebase
export const db: Firestore = getFirestore(app); // Serviço de Banco de Dados Firestore