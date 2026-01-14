import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export const UserController = {
  async list(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany({ select: { id: true, name: true, email: true } });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar usuários" });
    }
  },
  async create(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const newUser = await prisma.user.create({ data: { name, email, password } });
      res.json(newUser);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar usuário" });
    }
  }
};