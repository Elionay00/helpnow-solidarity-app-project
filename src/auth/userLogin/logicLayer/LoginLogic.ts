import { useState } from "react";
import { useHistory } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";
import { useIonToast } from "@ionic/react";

function useLoginLogic() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [presentToast] = useIonToast();
  const history = useHistory();

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const showToast = (message: string, color: string = "danger") => {
    presentToast({ message, duration: 3000, color, position: "bottom" });
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showToast("Por favor, preencha todos os campos.", "warning");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await signInWithEmailAndPassword(auth, email, password);
      showToast("Login realizado com sucesso!", "success");
      history.push("/tabs/home");
    } catch {
      setError("Email ou senha incorretos.");
      showToast("Email ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoToRegister = () => history.push("/register");
  const handleForgotPassword = () => history.push("/forgot-password");

  return {
    email, setEmail,
    password, setPassword,
    showPassword, toggleShowPassword,
    loading, error,
    handleLogin,
    handleGoToRegister,
    handleForgotPassword,
  };
}

export { useLoginLogic };
