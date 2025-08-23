const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware para JSON e CORS
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000' // Certifique-se que essa URL é a do seu front-end
}));

// Mock de um "banco de dados" de usuários. Em produção, use um banco de dados real.
const users = [
  { id: 1, email: 'teste@gmail.com', password: 'senha_segura' }
];

// Configurações do serviço de e-mail (Nodemailer)
// Você pode usar Gmail, SendGrid, etc.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'seu-email@gmail.com', // Substitua pelo seu e-mail
    pass: 'sua-senha-de-aplicativo' // Substitua pela sua senha de aplicativo
  }
});

// Chave secreta para os tokens JWT. Mantenha isso seguro e em variáveis de ambiente.
const JWT_SECRET = 'uma-string-secreta-bem-longa-e-aleatoria-deve-ser-usada';

// Rota de "Esqueci a Senha"
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  // 1. Encontre o usuário no "banco de dados"
  const user = users.find(u => u.email === email);

  // 2. Responda com sucesso, mesmo se o e-mail não for encontrado, por segurança
  if (!user) {
    return res.status(200).json({ message: 'Se o e-mail estiver cadastrado, um link de recuperação foi enviado.' });
  }

  // 3. Crie um token com o ID do usuário e um tempo de expiração
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

  // 4. Monte o link de redefinição
  const resetUrl = `http://localhost:3000/reset-password?token=${token}`;
  
  // 5. Crie o e-mail
  const mailOptions = {
    from: 'seu-email@gmail.com',
    to: user.email,
    subject: 'Redefinir sua senha',
    html: `<p>Olá,</p><p>Clique no link abaixo para redefinir sua senha:</p><a href="${resetUrl}">Redefinir Senha</a><p>Se você não solicitou isso, ignore este e-mail.</p>`
  };

  // 6. Envie o e-mail
  try {
    await transporter.sendMail(mailOptions);
    console.log(`E-mail enviado para: ${user.email}`);
    res.status(200).json({ message: 'Se o e-mail estiver cadastrado, um link de recuperação foi enviado.' });
  } catch (err) {
    console.error('Erro ao enviar e-mail:', err);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});