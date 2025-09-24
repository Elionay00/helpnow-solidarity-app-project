import * as yup from "yup";

export const registerSchema = yup.object().shape({
  fullName: yup.string().required("Nome completo é obrigatório."),
  email: yup.string().email("Email inválido.").required("Email é obrigatório."),
  cpf: yup
    .string()
    .required("CPF é obrigatório.")
    .test("cpf-valido", "CPF inválido.", value => {
      if (!value) return false;
      const digits = value.replace(/\D/g, "");
      return digits.length === 11;
    }),
  phone: yup
    .string()
    .required("Telefone é obrigatório.")
    .test("telefone-valido", "Número de telefone inválido.", value => {
      if (!value) return false;
      const digits = value.replace(/\D/g, "");
      return digits.length === 11;
    }),
  password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres.")
    .required("Senha é obrigatória."),
  confirmPassword: yup
    .string()
    .required("Confirmação de senha é obrigatória.")
    .test("senhas-iguais", "As senhas não coincidem.", function (value) {
      return value === this.parent.password;
    }),
});
