// packages/backend/server.js

const express = require('express');
const mongoose = require('mongoose');

// --- CONFIGURAÇÃO INICIAL ---
const app = express();
const PORT = process.env.PORT || 5000;
// IMPORTANTE: Substitua pela sua string de conexão do MongoDB Atlas
const MONGO_URI = "mongodb+srv://<db_username>:<db_23267889>@ajudaja-cluster.srsvsye.mongodb.net/?retryWrites=true&w=majority&appName=ajudaja-cluster";

// Middleware para permitir que o backend entenda JSON
app.use(express.json());


// --- CONEXÃO COM O BANCO DE DADOS ---
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB conectado com sucesso!"))
  .catch(err => console.error("Erro ao conectar ao MongoDB:", err));


// --- ROTAS DA API ---
// Rota de teste para ver se o servidor está no ar
app.get('/', (req, res) => {
  res.send('<h1>API do AjudaJá rodando!</h1>');
});

// Importa e usa a rota de parceiros que vamos criar
app.use('/api/parceiros', require('./routes/parceiros'));


// --- INICIAR O SERVIDOR ---
app.listen(PORT, () => {
  console.log(`Servidor escutando na porta http://localhost:${PORT}`);
});
