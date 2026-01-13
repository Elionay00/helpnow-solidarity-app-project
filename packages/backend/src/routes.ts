import { Router } from 'express';
import { login } from './controllers/AuthController';
import { UserController } from './controllers/UserController';
import { HelpController } from './controllers/HelpController';

const routes = Router();

// --- Rotas de Autenticação ---
routes.post('/login', login);

// --- Rotas de Usuário ---
routes.post('/users', UserController.create);
routes.get('/users', UserController.list);

// --- Rotas de Pedidos de Ajuda ('pedidos') ---
routes.post('/pedidos', HelpController.create);
routes.get('/pedidos', HelpController.listAll);

export default routes;