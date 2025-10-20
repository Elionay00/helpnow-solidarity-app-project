const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

class UserController {
  async create(req, res) {
    // ... seu método de criar usuário (não mexe aqui)
  }

  // NOVO MÉTODO PARA BUSCAR O PERFIL
  async showProfile(req, res) {
    try {
      // Graças ao middleware, nós temos o ID do usuário logado em `req.userId`
      const userId = req.userId;

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        // Isso é raro, mas é uma boa verificação de segurança
        return res.status(404).json({ error: 'User not found.' });
      }

      user.password = undefined; // Sempre remova a senha da resposta!

      return res.json(user);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }
}

module.exports = new UserController();