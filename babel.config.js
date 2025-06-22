module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Otimizações para melhor performance
      'react-native-reanimated/plugin',
    ],
  };
};
