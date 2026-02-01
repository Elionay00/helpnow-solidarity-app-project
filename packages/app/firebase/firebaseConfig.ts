import { initializeApp } from "firebase/app";
// Importamos o Auth de forma geral para funcionar em ambos
import { initializeAuth, getReactNativePersistence, browserLocalPersistence, Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyDFqkEMxBJh4dWz6CPqBZQ1WphzfhCJ1QI",
  authDomain: "ajudaja-8d5b6.firebaseapp.com",
  projectId: "ajudaja-8d5b6",
  storageBucket: "ajudaja-8d5b6.firebasestorage.app",
  messagingSenderId: "277310269351",
  appId: "1:277310269351:web:4a6c9a9a37aa3d21bbb882",
  measurementId: "G-CBCT4D4FFY"
};

const app = initializeApp(firebaseConfig);

let auth: Auth;

if (Platform.OS === 'web') {
  // Se for Web (Navegador), usa persistência de navegador
  auth = initializeAuth(app, {
    persistence: browserLocalPersistence
  });
} else {
  // Se for Celular (Android/iOS), usa o AsyncStorage
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

const firestore = getFirestore(app);

export { auth, firestore };