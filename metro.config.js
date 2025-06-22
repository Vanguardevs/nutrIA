const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Otimizações para melhor performance
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Otimizações de transformação
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true, // Habilita inline requires para melhor performance
    },
  }),
};

// Configurações de resolver para melhor performance
config.resolver = {
  ...config.resolver,
  useWatchman: true,
  enableGlobalPackages: true,
};

// Configurações de cache otimizadas (compatível com Expo)
config.cacheStores = undefined; // Remove configuração problemática

module.exports = config; 