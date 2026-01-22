import { initializeApp } from "firebase/app";
// Importamos o Auth de forma geral para funcionar em ambos
import { initializeAuth, getReactNativePersistence, browserLocalPersistence, Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
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