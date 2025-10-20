// packages/backend/src/routes/product.routes.js

import { Router } from 'express';
// Importa o "cozinheiro" que acabamos de criar
import ProductController from '../controllers/ProductController.js';

const router = Router();

// Quando alguém acessar GET /produtos, chame o método "index" do nosso cozinheiro
router.get('/produtos', ProductController.index);

// Quando alguém acessar POST /produtos, chame o método "store" do nosso cozinheiro
router.post('/produtos', ProductController.store);

export default router;