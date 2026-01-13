import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CreateUserSchema } from '@helpnow/shared'; 
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const UserController = {
  async list(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, trustScore: true }
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Erro ao listar usuários" });
    }
  },

  async create(req: Request, res: Response) {
    try {
      // 1. Valida os dados usando o Schema compartilhado
      const validatedData = CreateUserSchema.parse(req.body);
      const { name, email, password } = validatedData;

      // 2. Verifica se o email já existe
      const userExists = await prisma.user.findUnique({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: "Este e-mail já está em uso." });
      }

      // 3. Criptografa a senha (sal de 10 rounds)
      const hashedPassword = await bcrypt.hash(password, 10);

      // 4. Salva no banco
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
        select: { id: true, name: true, email: true } // Não retorna a senha no JSON
      });

      res.status(201).json(newUser);
    } catch (error: any) {
      // Retorna erros de validação do Zod de forma amigável
      if (error.errors) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  }
};