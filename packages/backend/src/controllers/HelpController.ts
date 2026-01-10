import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { HelpRequestSchema } from '@helpnow/shared';

const prisma = new PrismaClient();

export const HelpController = {
  async create(req: Request, res: Response) {
    try {
      const validatedData = HelpRequestSchema.parse(req.body);
      const { userId } = req.body; // No futuro pegaremos do Token

      const request = await prisma.helpRequest.create({
        data: { ...validatedData, userId }
      });

      res.status(201).json(request);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos para o pedido" });
    }
  },

  async listAll(req: Request, res: Response) {
    try {
      const requests = await prisma.helpRequest.findMany({
        include: { user: { select: { name: true } } }
      });
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar pedidos" });
    }
  }
};