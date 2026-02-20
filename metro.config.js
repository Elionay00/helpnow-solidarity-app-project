const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Adiciona suporte a extensões web e arquivos de módulos
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'web.js', 'web.ts', 'web.tsx'];

module.exports = config;