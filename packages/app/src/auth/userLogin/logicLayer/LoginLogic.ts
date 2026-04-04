import { useState } from "react";
import { useHistory } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";
import { useIonToast } from "@ionic/react";
import { FirebaseError } from "firebase/app";

function useLoginLogic() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [presentToast] = useIonToast();
  const history = useHistory();

  const showToast = (message: string, color: string = "danger") => {
    presentToast({ message, duration: 3000, color, position: "bottom" });
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showToast("Por favor, preencha todos os campos.", "warning");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToast("Login realizado com sucesso!", "success");
      history.push("/tabs/home");
    } catch (error) {
      let errorMessage = "Email ou senha incorretos.";
      showToast(errorMessage);
    }
  };

  const handleGoToRegister = () => {
    history.push("/register");
  };

  // --- ADICIONADO AQUI ---
  const handleForgotPassword = () => {
    history.push("/forgot-password");
  };

  return {
    email, setEmail,
    password, setPassword,
    showPassword, setShowPassword,
    handleLogin,
    handleGoToRegister,
    handleForgotPassword, // --- ADICIONADO NO RETURN TAMBÉM ---
  };
}

export { useLoginLogic };