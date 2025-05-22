import * as yup from 'yup'; // Importa o yup para criar schemas de validação

export const registerSchema = yup.object().shape({
  // Campo nomeCompleto: obrigatório, deve ser uma string não vazia
  nomeCompleto: yup.string().required('Nome completo é obrigatório'),

  // Campo email: obrigatório, deve ser uma string no formato de email válido
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  
  // Campo cpf: obrigatório, deve ter exatamente 14 caracteres (ex: 000.000.000-00)
  cpf: yup.string().required('CPF é obrigatório').length(14, 'CPF inválido'),
  
  // Campo telefone: obrigatório, deve ter exatamente 15 caracteres (ex: (00) 00000-0000)
  telefone: yup.string().required('Telefone é obrigatório').length(15, 'Telefone inválido'),
  
  // Campo senha: obrigatório, deve ter no mínimo 6 caracteres
  senha: yup.string().min(6, 'Mínimo 6 caracteres').required('Senha é obrigatória'),
  
  // Campo confirmaSenha: obrigatório, deve ser igual ao valor do campo senha
  confirmaSenha: yup.string()
    .oneOf([yup.ref('senha')], 'As senhas não coincidem')
    .required('Confirmação de senha obrigatória'),
});