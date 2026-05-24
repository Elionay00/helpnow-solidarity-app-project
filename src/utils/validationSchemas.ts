import * as yup from "yup";

export const registerSchema = yup.object().shape({
  fullName: yup.string().required("Nome completo obrigatorio."),
  email: yup.string().email("Email invalido.").required("Email obrigatario."),
  phone: yup
    .string()
    .optional()
    .test("telefone-valido", "Numero de telefone invalido.", value => {
      if (!value) return true;
      const digits = value.replace(/\D/g, "");
      return digits.length === 11;
    }),
  password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres.")
    .required("Senha obrigatria."),
  confirmPassword: yup
    .string()
    .required("Confirmação de senha é obrigataria.")
    .test("senhas-iguais", "As senhas não coincidem.", function (value) {
      return value === this.parent.password;
    }),
});
