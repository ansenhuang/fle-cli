var config = require('./config');

var babelConfig = {
  "presets": [
    [
      require.resolve("babel-preset-env"),
      {
        "modules": false,
        "loose": true,
        "useBuiltIns": false,
        "targets": {
          "browsers": config.fle.browsers
        }
      }
    ],
    config.react && require.resolve("babel-preset-react"),
    require.resolve("babel-preset-stage-2")
  ].filter(p => p),
  "plugins": [
    config.vue && require.resolve("babel-plugin-transform-vue-jsx"),
    require.resolve("babel-plugin-transform-decorators-legacy"),
    require.resolve("babel-plugin-transform-runtime")
  ].filter(p => p)
};

module.exports = babelConfig;
