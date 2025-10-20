const { Router } = require('express');
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middlewares/auth'); // 1. IMPORTAMOS O NOSSO SEGURANÇA

const userRoutes = Router();

// Rota pública: qualquer um pode criar um usuário
userRoutes.post('/', UserController.create);

// ---- A PARTIR DAQUI, TODAS AS ROTAS PRECISAM DE AUTENTICAÇÃO ----

userRoutes.use(authMiddleware); // 2. APLICAMOS O SEGURANÇA EM TODAS AS ROTAS ABAIXO DELE

// Rota privada: só usuários logados podem ver seu perfil
userRoutes.get('/profile', UserController.showProfile); // 3. CRIAMOS A ROTA E O MÉTODO NO CONTROLLER

module.exports = userRoutes;