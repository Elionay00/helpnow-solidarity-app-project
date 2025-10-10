const express = require('express');
const router = express.Router();

// 1. Importamos o nosso "engenheiro", o userController.
const userController = require('../controllers/userController');

// 2. Criamos a rota para o cadastro de usuários.
// Quando uma requisição do tipo POST chegar no endereço '/usuarios',
// o método 'createUser' do nosso controller será executado.
router.post('/usuarios', userController.createUser);

// Adicione outras rotas de usuário aqui no futuro (ex: login, buscar usuário, etc.)

// 3. Exportamos o router com a nossa nova rota configurada.
module.exports = router;