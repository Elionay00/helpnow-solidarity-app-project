const jwt = require('jsonwebtoken');
const { promisify } = require('util');

// Reutilize a configuração do seu SessionController. O ideal é ter isso num único arquivo de configuração.
const authConfig = {
  secret: 'SEU_SEGREDO_SUPER_SECRETO_AQUI', // USE EXATAMENTE O MESMO SEGREDO DO LOGIN!
};

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided.' });
  }

  // O token vem no formato "Bearer eyJhbGciOi...". Vamos separar e pegar só o token.
  const [, token] = authHeader.split(' ');

  try {
    // Verifica se o token é válido usando o segredo
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // Se for válido, o 'decoded' terá o id do usuário que colocamos lá no login.
    // Vamos anexar esse id na requisição para que a próxima função (o controller) possa usá-lo.
    req.userId = decoded.id;

    return next(); // Deixa a requisição continuar para o controller
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid.' });
  }
};