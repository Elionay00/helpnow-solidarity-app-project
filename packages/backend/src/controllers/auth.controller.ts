import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

// É crucial que esta chave secreta seja guardada de forma segura,
// por exemplo, em variáveis de ambiente.
const JWT_SECRET = process.env.JWT_SECRET || 'chave_mestra_para_teste';

export const login = async (req: Request, res: Response) => {
  try {
    // 1. Valida os dados que vem do corpo da requisição
    const { email, password } = loginSchema.parse(req.body);
    
    // 2. Busca o usuário no banco de dados
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // 3. Compara a senha fornecida com a senha hasheada no banco
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // 4. Gera o JWT com informações úteis (como o ID do usuário)
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 5. Retorna o token e os dados do usuário (sem a senha)
    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error: any) {
    if (error.errors) { // Erros de validação do Zod
      return res.status(400).json({ errors: error.errors });
    }
    console.error(error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};
