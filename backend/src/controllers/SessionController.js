const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs'); // Para comparar a senha
const jwt = require('jsonwebtoken'); // Para criar o token

// Crie uma chave secreta para o seu token. Guarde isso no seu arquivo .env!
// Por agora, vamos deixar aqui para simplificar.
const authConfig = {
  secret: 'SEU_SEGREDO_SUPER_SECRETO_AQUI', // Troque isso por uma frase longa e aleatória
  expiresIn: '7d', // Token expira em 7 dias
};

class SessionController {
  async create(req, res) {
    const { email, password } = req.body;

    // 1. Encontrar o usuário pelo e-mail
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    // 2. Verificar se a senha está correta
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid password.' });
    }

    // 3. Se tudo estiver certo, gerar o Token (o "crachá")
    const { id, name } = user;
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    // Não retornar a senha
    user.password = undefined;

    // Retornar os dados do usuário e o token
    return res.json({ user, token });
  }
}

module.exports = new SessionController();