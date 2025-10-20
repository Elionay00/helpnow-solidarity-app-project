const { Router } = require('express');
const SessionController = require('../controllers/SessionController'); // Vamos criar este arquivo a seguir

const sessionRoutes = Router();

// A rota de login será um POST para /sessions
sessionRoutes.post('/', SessionController.create);

module.exports = sessionRoutes;