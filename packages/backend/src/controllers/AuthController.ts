import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

// Item 1 da Imagem: Validar entrada com Zod
const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

const JWT_SECRET = "sua_chave_secreta_aqui";

export const login = async (req: Request, res: Response) => {
  try {
    // Valida os dados que vem do corpo da requisição
    const { email, password } = loginSchema.parse(req.body);

    // Gera o JWT (Item 1 da Imagem)
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1d' });

    return res.json({
      token,
      user: { email }
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.errors });
  }
};