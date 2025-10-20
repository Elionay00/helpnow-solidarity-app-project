// packages/backend/src/controllers/ProductController.js

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class ProductController {
  // Método para LISTAR todos os produtos (será usado em GET /produtos)
  async index(req, res) {
    try {
      const products = await prisma.product.findMany({
        include: {
          seller: {
            select: {
              name: true,
              storeName: true,
            },
          },
        },
      });
      return res.json(products);
    } catch (error) {
      return res.status(500).json({ error: 'Nao foi possivel buscar os produtos.' });
    }
  }

  // Método para CRIAR um novo produto (será usado em POST /produtos)
  async store(req, res) {
    const { name, description, price, images, category, sellerId } = req.body;

    if (!name || !price || !sellerId) {
      return res.status(400).json({ error: 'Nome, preço e ID do vendedor são obrigatórios.' });
    }

    try {
      const newProduct = await prisma.product.create({
        data: {
          name,
          description,
          price,
          images,
          category,
          sellerId,
        },
      });
      return res.status(201).json(newProduct);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Nao foi possivel criar o produto.' });
    }
  }
}

export default new ProductController();