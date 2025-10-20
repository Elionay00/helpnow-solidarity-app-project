// packages/backend/models/Parceiro.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a estrutura (o "molde") de como os dados de um parceiro
// serão salvos no banco de dados.
const ParceiroSchema = new Schema({
  nome: {
    type: String,
    required: true,
  },
  logoUrl: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  siteUrl: {
    type: String,
  },
  // Podemos adicionar mais campos no futuro, como o tipo de plano.
});

// Cria e exporta o modelo a partir do Schema definido.
// O Mongoose vai criar uma coleção chamada "parceiros" no banco de dados.
module.exports = mongoose.model('Parceiro', ParceiroSchema);
