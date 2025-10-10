// A maneira profissional de modelar dados em Node.js com o banco de dados MongoDB
// é usando uma biblioteca chamada Mongoose.
const mongoose = require('mongoose');

// 'Schema' é a planta, a estrutura dos dados de um usuário.
const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true // O nome é obrigatório
  },
  email: {
    type: String,
    required: true, // O email é obrigatório
    unique: true // Cada email deve ser único no banco de dados
  },
  senha: {
    type: String,
    required: true // A senha é obrigatória
  },
  tipo: {
    type: String,
    required: true,
    enum: ['cliente', 'prestador'] // O tipo só pode ser um desses dois valores
  },
  cidade: {
    type: String,
    default: 'Belém' // Se a cidade não for informada, o padrão será 'Belém'
  },
  notaMedia: {
    type: Number,
    default: 0 // A nota de avaliação começa com 0
  },
  dataCadastro: {
    type: Date,
    default: Date.now // A data de cadastro é preenchida automaticamente
  }
});

// Cria e exporta o modelo 'User' baseado no schema que definimos
module.exports = mongoose.model('User', userSchema);