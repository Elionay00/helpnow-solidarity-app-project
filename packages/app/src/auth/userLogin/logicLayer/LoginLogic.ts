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
      
      // A correção crucial está aqui:
      history.push("/tabs/home");
      
    } catch (error) {
      let errorMessage = "Erro ao entrar. Verifique suas credenciais.";
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/user-not-found":
          case "auth/wrong-password":
          case "auth/invalid-credential":
            errorMessage = "Email ou senha incorretos.";
            break;
          case "auth/invalid-email":
            errorMessage = "Formato de email inválido.";
            break;
          case "auth/user-disabled":
            errorMessage = "Este usuário foi desativado.";
            break;
        }
      }
      showToast(errorMessage);
    }
  };

  const handleGoToRegister = () => {
    history.push("/register");
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    handleLogin,
    handleGoToRegister,
  };
}

export { useLoginLogic };