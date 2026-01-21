const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const { withNativeWind } = require('nativewind/metro'); // <--- 1. Importamos isto

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Faz o Metro olhar para a raiz do workspace
config.watchFolders = [workspaceRoot];

// 2. Resolve módulos da raiz e do app
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

config.resolver.disableHierarchicalLookup = true;

// 3. Bloqueio do backend (mantemos isso para não quebrar)
config.resolver.blockList = [
  ...(config.resolver.blockList || []),
  /packages\/backend\/.*/,
];

// 4. A MÁGICA: Envolvemos a config com o NativeWind
module.exports = withNativeWind(config, { input: './global.css' });