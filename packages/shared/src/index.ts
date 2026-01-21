import { z } from 'zod';

// ==========================================
// MÓDULO: AUTENTICAÇÃO E USUÁRIOS
// ==========================================

// 1. Schema para Cadastro (O que o usuário envia)
export const CreateUserSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

// Inferência do tipo TypeScript para o Frontend usar no useForm
export type CreateUserDTO = z.infer<typeof CreateUserSchema>;

// 2. Schema para Login
export const LoginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "A senha é obrigatória"),
});

export type LoginDTO = z.infer<typeof LoginSchema>;

// 3. Tipos de Resposta (O que o Backend devolve já salvo)
// Isso será usado para tipar o Contexto de Auth no Frontend
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ==========================================
// MÓDULO: PEDIDOS DE AJUDA (CORE)
// ==========================================

// Enum para garantir consistência entre Front e Back
export const HelpCategoryEnum = z.enum(['ALIMENTOS', 'MEDICAMENTOS', 'TRANSPORTE', 'OUTROS']);
export type HelpCategory = z.infer<typeof HelpCategoryEnum>;

// 1. Schema para Criar Pedido
export const HelpRequestSchema = z.object({
  title: z.string().min(5, "Título muito curto (mínimo 5 letras)"),
  description: z.string().min(10, "Descreva melhor sua necessidade (mínimo 10 letras)"),
  category: HelpCategoryEnum,
  latitude: z.number({ required_error: "Localização é obrigatória" }),
  longitude: z.number({ required_error: "Localização é obrigatória" }),
});

export type HelpRequestDTO = z.infer<typeof HelpRequestSchema>;

// 2. Tipo Completo do Pedido (Como ele vem do Banco)
export interface HelpRequest extends HelpRequestDTO {
  id: string;
  status: 'OPEN' | 'CLOSED' | 'IN_PROGRESS';
  userId: string;
  user?: User; // Opcional: para quando incluirmos os dados do dono do pedido
  createdAt: string | Date;
}