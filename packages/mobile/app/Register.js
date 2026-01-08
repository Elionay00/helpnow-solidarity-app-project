const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => res.send('🚀 Backend HelpNow Rodando na 5001!'));

// Rota de Cadastro
app.post('/api/usuarios', async (req, res) => {
  try {
    const { email, name } = req.body;
    const novoUsuario = await prisma.user.create({ data: { email, name } });
    console.log("✅ Usuário salvo:", novoUsuario);
    res.json(novoUsuario);
  } catch (error) {
    console.error("❌ Erro:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// AQUI ESTÁ A MUDANÇA PARA A PORTA 5001
const PORT = 5001; 
app.listen(PORT, () => {
  console.log(`\n=========================================`);
  console.log(`✅ SERVIDOR RODANDO EM: http://localhost:${PORT}`);
  console.log(`=========================================\n`);
});