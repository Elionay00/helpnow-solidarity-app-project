const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// força o Metro a usar o react-native-web correto
config.resolver.extraNodeModules = {
  "react-native-web": require.resolve("react-native-web"),
};

module.exports = config;
