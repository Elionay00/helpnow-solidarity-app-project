// packages/backend/src/server.js

import express from 'express';
import cors from 'cors';
// 1. IMPORTAMOS O ARQUIVO DE ROTAS DE PRODUTOS
import productRoutes from './routes/product.routes.js';

const app = express();
const port = 3333;

app.use(cors());
app.use(express.json());

// 2. DIZEMOS AO SERVIDOR PARA USAR AS ROTAS DE PRODUTOS
// Todas as rotas dentro do arquivo começarão com /api
app.use('/api', productRoutes);

app.listen(port, () => {
  console.log(`🚀 Backend rodando em http://localhost:${port}`);
});