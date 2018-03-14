var path = require('path');
var config = require('./config');
var loader = require('./loader');
var plugin = require('./plugin');
var resolve = require('../utils').resolve;

//基本配置
var webpackConfig = {
  // entry: {},
  cache: true,
  devtool: false,
  // output: {},
  resolve: {
    modules: [
      resolve('node_modules'),
      path.join(__dirname, '../../node_modules')
    ],
    extensions: ['.js'],
    alias: {
      '@': resolve('src')
    }
  },
  resolveLoader: {
    modules: [
      path.join(__dirname, '../../node_modules'),
      resolve('node_modules')
    ]
  },
  module: {
    rules: [
      config.fle.eslint && loader.eslint(),
      loader.css(),
      loader.cssModules(),
      config.vue && loader.vue(),
      loader.babel(),
      loader.text(),
      loader.images(),
      loader.fonts(),
      loader.medias()
    ].filter(r => r)
  },
  //配置插件
  plugins: [
    plugin.define(),
    plugin.loader()
  ],
  externals: {},
  target: 'web',
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
};

module.exports = webpackConfig;
