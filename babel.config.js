// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // …any other plugins you actually need (e.g. decorators, etc.)…
      'react-native-reanimated/plugin',   // ← **this must be LAST**
    ],
  };
};
