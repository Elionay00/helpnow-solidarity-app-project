import { Router } from 'express';
import { login } from './controllers/AuthController';
import { UserController } from './controllers/UserController';
import { HelpController } from './controllers/HelpController';

const routes = Router();

// --- Rotas de Autenticação ---
routes.post('/login', login);

// --- Rotas de Usuário ---
// Certifique-se que o UserController tem as funções 'create' e 'list'
routes.post('/users', UserController.create);
routes.get('/users', UserController.list);

// --- Rotas de Pedidos de Ajuda ---
// Aqui usamos 'listAll' para bater com o controlador que corrigimos
routes.post('/pedidos', HelpController.create);
routes.get('/pedidos', HelpController.listAll);

export default routes;