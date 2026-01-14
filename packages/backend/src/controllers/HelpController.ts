import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
export const HelpController = {
  async create(req: Request, res: Response) {
    const { title, description, userId } = req.body;
    try {
      const request = await prisma.order.create({
        data: {
          title,
          description,
          status: 'Aberto',
          userId: Number(userId)
        }
      });
      res.status(201).json(request);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar pedido." });
    }
  },
  async listAll(req: Request, res: Response) {
    try {
      const requests = await prisma.order.findMany({ include: { user: true } });
      res.json(requests);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao listar pedidos." });
    }
  }
};