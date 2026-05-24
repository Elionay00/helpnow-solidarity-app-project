import { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";
import { useIonToast } from "@ionic/react";
import { FirebaseError } from "firebase/app";
import IMask from "imask";
import { registerSchema } from "../../../utils/validationSchemas";
import { ValidationError } from "yup";

function useRegisterLogic() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const telInputRef = useRef<any>(null);
  const telMaskRef = useRef<any>(null);

  const [presentToast] = useIonToast();
  const history = useHistory();

  useEffect(() => {
    async function setupMasks() {
      if (telInputRef.current) {
        const el = await telInputRef.current.getInputElement();
        if (el && !telMaskRef.current) {
          telMaskRef.current = IMask(el, { mask: "(00) 00000-0000" });
        }
      }
    }
    setupMasks();
    return () => {
      if (telMaskRef.current) telMaskRef.current.destroy();
    };
  }, []);

  const showToast = (message: string, color: string = "danger") => {
    presentToast({ message, duration: 3000, color, position: "bottom" });
  };

  const handleRegister = async () => {
    const phone = telMaskRef.current?.unmaskedValue || "";

    const formData = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone,
      password: password.trim(),
      confirmPassword: confirmPassword.trim(),
    };

    try {
      setLoading(true);
      setErrors({});
      await registerSchema.validate(formData, { abortEarly: false });
      await createUserWithEmailAndPassword(auth, email, password);
      showToast("Cadastro realizado com sucesso!", "success");
      history.push("/tabs/home");
    } catch (error) {
      if (error instanceof ValidationError) {
        const newErrors: Record<string, string> = {};
        error.inner.forEach((err) => { if (err.path) newErrors[err.path] = err.message; });
        setErrors(newErrors);
        return;
      }
      let errorMessage = "Erro ao cadastrar.";
      if (error instanceof FirebaseError) {
        if (error.code === "auth/email-already-in-use") {
          errorMessage = "Este e-mail já está em uso.";
        }
      }
      showToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => history.push("/login");

  return {
    fullName, setFullName,
    email, setEmail,
    telInputRef,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    showPassword, setShowPassword,
    showConfirmPassword, setShowConfirmPassword,
    loading,
    errors,
    handleRegister,
    handleGoToLogin,
  };
}

export { useRegisterLogic };
