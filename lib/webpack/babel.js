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
    require.resolve("babel-preset-stage-2")
  ],
  "plugins": [
    require.resolve("babel-plugin-transform-decorators-legacy"),
    require.resolve("babel-plugin-transform-runtime")
  ]
};

if (config.fle.boilerplate === 'react') {
  babelConfig.presets.push(require.resolve("babel-preset-react"));
} else if (config.fle.boilerplate === 'vue') {
  babelConfig.plugins.push(require.resolve("babel-plugin-transform-vue-jsx"));
}

module.exports = babelConfig;
