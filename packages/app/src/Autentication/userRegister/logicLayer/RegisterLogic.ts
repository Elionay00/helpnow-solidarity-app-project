import { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";
import { useIonToast, type IonInput } from "@ionic/react";
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
  const cpfInputRef = useRef<IonInput | null>(null);
  const telInputRef = useRef<IonInput | null>(null);
  const cpfMaskRef = useRef<IMask.Masked | null>(null);
  const telMaskRef = useRef<IMask.Masked | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [presentToast] = useIonToast();
  const history = useHistory();

  useEffect(() => {
    async function setupMasks() {
      if (cpfInputRef.current && !cpfMaskRef.current) {
        const cpfInputElement = await cpfInputRef.current.getInputElement();
        cpfMaskRef.current = IMask(cpfInputElement, { mask: "000.000.000-00" });
      }

      if (telInputRef.current && !telMaskRef.current) {
        const telInputElement = await telInputRef.current.getInputElement();
        telMaskRef.current = IMask(telInputElement, { mask: "(00) 00000-0000" });
      }
    }

    setupMasks();

    return () => {
      cpfMaskRef.current?.destroy();
      telMaskRef.current?.destroy();
    };
  }, []);

  const showToast = (message: string, color: string = "danger") => {
    presentToast({ message, duration: 3000, color, position: "bottom" });
  };

  const handleRegister = async () => {
    const cpf = cpfMaskRef.current?.unmaskedValue || "";
    const phone = telMaskRef.current?.unmaskedValue || "";

    const formData = {
      fullName: fullName.trim(),
      email: email.trim(),
      cpf,
      phone,
      password: password.trim(),
      confirmPassword: confirmPassword.trim(),
    };

    try {
      setErrors({});
      await registerSchema.validate(formData, { abortEarly: false });

      await createUserWithEmailAndPassword(auth, email, password);
      showToast("Cadastro realizado com sucesso!", "success");
      history.push("/home");

    } catch (error) {
      if (error instanceof ValidationError) {
        const newErrors: Record<string, string> = {};
        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path] = err.message;
          }
        });
        setErrors(newErrors);
        showToast("Por favor, corrija os erros do formulário.", "warning");
        return;
      }

      let errorMessage = "Erro ao cadastrar. Tente novamente.";
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/email-already-in-use":
            errorMessage = "Este email já está em uso.";
            break;
          case "auth/invalid-email":
            errorMessage = "Email inválido.";
            break;
          case "auth/weak-password":
            errorMessage = "Senha fraca. Escolha uma mais segura.";
            break;
        }
      }
      showToast(errorMessage);
    }
  };

  const handleGoToLogin = () => {
    history.push("/login");
  };

  return {
    fullName,
    setFullName,
    email,
    setEmail,
    cpfInputRef,
    telInputRef,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    errors,
    handleRegister,
    handleGoToLogin,
  };
}

export { useRegisterLogic };
