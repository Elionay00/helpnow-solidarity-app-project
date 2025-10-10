// Importe as funções necessárias do Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// As suas credenciais de configuração do Firebase
const firebaseConfig = {
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);

// Inicialize os serviços e exporte-os
export const auth = getAuth(app);
export const db = getFirestore(app);