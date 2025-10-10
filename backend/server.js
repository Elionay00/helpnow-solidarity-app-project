const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3001;

// Importa as rotas de usuário
const userRoutes = require('./src/routes/userRoutes');

// --- CONEXÃO COM O BANCO DE DADOS ---
// Corrigido: Removidos os caracteres '<' e '>' do usuário e da senha.
const DB_STRING = "mongodb+srv://ajudaja_user:23267889@ajudaja-cluster.srsvsye.mongodb.net/?retryWrites=true&w=majority&appName=ajudaja-cluster";

mongoose.connect(DB_STRING)
  .then(() => console.log('✅ Conectado ao MongoDB com sucesso!'))
  .catch((err) => console.error('❌ Erro ao conectar ao MongoDB:', err));

// --- MIDDLEWARES ---
app.use(express.json());

// --- ROTAS ---
app.use('/api', userRoutes);

app.get('/', (req, res) => {
  res.send('API do AjudaJá PRO está funcionando!');
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor do AjudaJá rodando na porta ${PORT}.`);
});