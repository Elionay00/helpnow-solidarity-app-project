const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot);

const config = getDefaultConfig(projectRoot);

// 👇 força o Metro a usar UMA única cópia de React
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
];

config.watchFolders = [workspaceRoot];

module.exports = config;
