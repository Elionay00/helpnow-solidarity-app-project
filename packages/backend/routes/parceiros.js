// packages/backend/routes/parceiros.js

const express = require('express');
const router = express.Router();

// Importa o "molde" do Parceiro que criamos
const Parceiro = require('../models/Parceiro');

/**
 * @route   GET /api/parceiros
 * @desc    Buscar todas as empresas parceiras
 * @access  Público
 */
router.get('/', async (req, res) => {
  try {
    // Pede ao modelo 'Parceiro' para encontrar todos os documentos
    const parceiros = await Parceiro.find();
    // Envia a lista encontrada como resposta em formato JSON
    res.json(parceiros);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

/**
 * @route   POST /api/parceiros
 * @desc    Adicionar uma nova empresa parceira (apenas para seu controle)
 * @access  Privado (no futuro, proteger esta rota)
 */
router.post('/', async (req, res) => {
    try {
        const novoParceiro = new Parceiro({
            nome: req.body.nome,
            logoUrl: req.body.logoUrl,
            descricao: req.body.descricao,
            siteUrl: req.body.siteUrl,
        });

        const parceiro = await novoParceiro.save();
        res.json(parceiro);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no Servidor');
    }
});


module.exports = router;
