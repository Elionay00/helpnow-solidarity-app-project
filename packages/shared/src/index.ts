import { z } from 'zod';

// --- SCHEMA DE CADASTRO ---
// Define as regras para criar um novo usuário
export const CreateUserSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

// Gera o tipo TypeScript automaticamente a partir do Schema
export type CreateUserDTO = z.infer<typeof CreateUserSchema>;


// --- SCHEMA DE LOGIN ---
// Define as regras para autenticação
export const LoginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "A senha é obrigatória"),
});

export type LoginDTO = z.infer<typeof LoginSchema>;


// --- SCHEMA DE PEDIDO DE AJUDA (Antecipando próxima fase) ---
export const HelpRequestSchema = z.object({
  title: z.string().min(5, "Título muito curto"),
  description: z.string().min(10, "Descreva melhor sua necessidade"),
  category: z.enum(['ALIMENTOS', 'MEDICAMENTOS', 'TRANSPORTE', 'OUTROS']),
  latitude: z.number(),
  longitude: z.number(),
});

export type HelpRequestDTO = z.infer<typeof HelpRequestSchema>;