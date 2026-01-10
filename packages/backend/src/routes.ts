import { Router } from 'express';
import { UserController } from './controllers/UserController';
import { AuthController } from './controllers/AuthController';
import { HelpController } from './controllers/HelpController';

const routes = Router();

// Usuários e Auth
routes.get('/users', UserController.list);
routes.post('/users', UserController.create);
routes.post('/login', AuthController.login);

// Pedidos de Ajuda
routes.post('/help', HelpController.create);
routes.get('/help', HelpController.listAll);

export default routes;