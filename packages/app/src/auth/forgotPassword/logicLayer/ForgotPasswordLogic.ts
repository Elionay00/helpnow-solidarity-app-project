import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";
import { useIonToast } from "@ionic/react";
import { useHistory } from "react-router-dom";

function useForgotPasswordLogic() {
  const [email, setEmail] = useState("");
  const [presentToast] = useIonToast();
  const history = useHistory();

  const showToast = (message: string, color: string = "success") => {
    presentToast({ message, duration: 3000, color, position: "bottom" });
  };

  const handleResetPassword = async () => {
    if (!email) {
      showToast("Por favor, insira seu e-mail.", "warning");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      showToast("E-mail de redefinição enviado! Verifique sua caixa de entrada.");
      
      setTimeout(() => {
        history.push("/login");
      }, 2000);
      
    } catch (error: any) {
      let errorMessage = "Erro ao enviar e-mail. Verifique os dados.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "Este e-mail não está cadastrado.";
      }
      showToast(errorMessage, "danger");
    }
  };

  const handleGoBack = () => {
    history.push("/login");
  };

  return {
    email,
    setEmail,
    handleResetPassword,
    handleGoBack,
  };
}

export { useForgotPasswordLogic };
