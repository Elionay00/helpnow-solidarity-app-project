import { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";
import { useIonToast } from "@ionic/react";
import IMask from "imask";

function useRegisterLogic() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const cpfInputRef = useRef<any>(null);
  const telInputRef = useRef<any>(null);
  const cpfMaskRef = useRef<any>(null);
  const telMaskRef = useRef<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [presentToast] = useIonToast();
  const history = useHistory();

  useEffect(() => {
    async function setupMasks() {
      if (cpfInputRef.current && !cpfMaskRef.current) {
        const cpfInputElement = await cpfInputRef.current.getInputElement();
        cpfMaskRef.current = IMask(cpfInputElement, {
          mask: "000.000.000-00",
          lazy: true,
        });
      }

      if (telInputRef.current && !telMaskRef.current) {
        const telInputElement = await telInputRef.current.getInputElement();
        telMaskRef.current = IMask(telInputElement, {
          mask: [{ mask: "(00) 00000-0000" }, { mask: "(00) 0000-0000" }],
          lazy: false,
        });
      }
    }

    setupMasks();

    return () => {
      cpfMaskRef.current?.destroy();
      telMaskRef.current?.destroy();
    };
  }, []);

  const showToast = (message: string, color: string = "danger") => {
    presentToast({
      message,
      duration: 3000,
      color,
      position: "bottom",
    });
  };

  const handleRegister = async () => {
    const cpf = cpfMaskRef.current?.value || "";
    const phone = telMaskRef.current?.value || "";

    // Validação se todos os campos estão vazios
    if (
      !fullName.trim() &&
      !email.trim() &&
      !cpf.trim() &&
      !phone.trim() &&
      !password.trim() &&
      !confirmPassword.trim()
    ) {
      showToast(
        "Por favor, preencha o formulário antes de cadastrar.",
        "warning"
      );
      return;
    }

    setErrors({});
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = "Nome é obrigatório.";
    if (!email.trim()) newErrors.email = "Email é obrigatório.";
    if (!cpf.trim()) newErrors.cpf = "CPF é obrigatório.";
    if (!phone.trim()) newErrors.phone = "Telefone é obrigatório.";
    if (!password.trim()) newErrors.password = "Senha é obrigatória.";
    if (!confirmPassword.trim())
      newErrors.confirmPassword = "Confirme a senha.";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "As senhas não coincidem.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast("Por favor, corrija os erros do formulário.", "warning");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      showToast("Cadastro realizado com sucesso!", "success");
      history.push("/home");
    } catch (error: any) {
      let errorMessage = "Erro ao cadastrar. Tente novamente.";

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
