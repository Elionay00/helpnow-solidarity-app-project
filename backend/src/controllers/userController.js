// 1. Importamos o nosso modelo de Usuário para poder interagir com o banco de dados.
const User = require('../models/User');

// Função para criar um novo usuário
// Usamos 'async' porque operações de banco de dados são assíncronas (levam um tempo)
const createUser = async (req, res) => {
  try {
    // 2. Pegamos os dados (nome, email, etc.) que vêm do corpo da requisição
    const { nome, email, senha, tipo, cidade } = req.body;

    // 3. Verificamos se um usuário com este email já existe para evitar duplicados
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      // Se o usuário já existe, retornamos um erro 400 (Bad Request)
      return res.status(400).json({ message: 'Este email já está em uso.' });
    }

    // 4. Criamos uma nova instância do nosso modelo User com os dados recebidos
    const newUser = new User({
      nome,
      email,
      senha, // Lembre-se: em um projeto real, vamos criptografar isso!
      tipo,
      cidade
    });

    // 5. Usamos o 'await' para esperar o usuário ser salvo no banco de dados
    await newUser.save();

    // 6. Se tudo deu certo, retornamos uma resposta de sucesso (status 201 - Created)
    res.status(201).json({ message: 'Usuário criado com sucesso!', user: newUser });

  } catch (error) {
    // 7. Se qualquer erro acontecer no bloco 'try', nós o "pegamos" aqui
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ message: 'Ocorreu um erro no servidor ao tentar criar o usuário.' });
  }
};

// Exportamos a função para que ela possa ser usada em outros arquivos (nas rotas)
module.exports = {
  createUser
};