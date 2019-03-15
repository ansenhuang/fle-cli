var config = require('./config');

var babelConfig = {
  "ignore": [
    "**/*.min.js"
  ],
  "presets": [
    [
      require.resolve("@babel/preset-env"),
      {
        "modules": false,
        "loose": true,
        "useBuiltIns": 'usage',
        "targets": {
          "browsers": config.fle.browsers
        }
      }
    ],
    config.react && require.resolve("@babel/preset-react")
  ].filter(p => p),
  "plugins": [
    [require.resolve("@babel/plugin-proposal-decorators"), { "legacy": true }],
    require.resolve("@babel/plugin-proposal-export-namespace-from"),
    require.resolve("@babel/plugin-syntax-dynamic-import"),
    [require.resolve("@babel/plugin-proposal-class-properties"), { "loose": true }],
    require.resolve("@babel/plugin-proposal-json-strings"),
    require.resolve("@babel/plugin-transform-runtime"),

    config.vue && require.resolve("babel-plugin-transform-vue-jsx")
  ].filter(p => p)
};

module.exports = babelConfig;
