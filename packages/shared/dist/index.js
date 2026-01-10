"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpRequestSchema = exports.LoginSchema = exports.CreateUserSchema = void 0;
const zod_1 = require("zod");
// --- SCHEMA DE CADASTRO ---
// Define as regras para criar um novo usuário
exports.CreateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    email: zod_1.z.string().email("E-mail inválido"),
    password: zod_1.z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});
// --- SCHEMA DE LOGIN ---
// Define as regras para autenticação
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email("E-mail inválido"),
    password: zod_1.z.string().min(1, "A senha é obrigatória"),
});
// --- SCHEMA DE PEDIDO DE AJUDA (Antecipando próxima fase) ---
exports.HelpRequestSchema = zod_1.z.object({
    title: zod_1.z.string().min(5, "Título muito curto"),
    description: zod_1.z.string().min(10, "Descreva melhor sua necessidade"),
    category: zod_1.z.enum(['ALIMENTOS', 'MEDICAMENTOS', 'TRANSPORTE', 'OUTROS']),
    latitude: zod_1.z.number(),
    longitude: zod_1.z.number(),
});
//# sourceMappingURL=index.js.map