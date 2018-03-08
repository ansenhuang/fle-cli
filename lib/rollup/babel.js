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
    require.resolve("babel-plugin-external-helpers")
  ]
};

module.exports = babelConfig;
