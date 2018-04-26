var config = require('./config');

var babelConfig = {
  "ignore": [
    "**/*.min.js"
  ],
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

module.exports = babelConfig;
