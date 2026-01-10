import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { LoginSchema } from '@helpnow/shared';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta_provisoria';

export const AuthController = {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = LoginSchema.parse(req.body);

      // 1. Busca usuário
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: "E-mail ou senha inválidos" });
      }

      // 2. Compara a senha digitada com a criptografada no banco
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "E-mail ou senha inválidos" });
      }

      // 3. Gera o Token JWT (vale por 7 dias)
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      res.json({
        user: { id: user.id, name: user.name, email: user.email },
        token
      });
    } catch (error: any) {
      res.status(400).json({ error: "Dados inválidos" });
    }
  }
};