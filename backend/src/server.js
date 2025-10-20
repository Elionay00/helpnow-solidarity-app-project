// ... outras importações
const sessionRoutes = require('./routes/session.routes.js'); // Importa nossas rotas de sessão

// ...
// app.use(express.json());
// ...

// Registre as rotas de usuário e de sessão
app.use('/users', userRoutes);
app.use('/sessions', sessionRoutes); // TUDO que chegar em /sessions será gerenciado pelo sessionRoutes

// ... app.listen