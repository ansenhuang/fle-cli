var path = require('path');
var config = require('./config');
var loader = require('./loader');
var plugin = require('./plugin');
var { resolve } = require('./utils');

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
    extensions: ['.js', '.vue', '.jsx', '.css'],
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
    config.vue && plugin.vue()
  ].filter(p => p),
  externals: {},
  target: 'web',
  node: {
    setImmediate: false,
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
};

module.exports = webpackConfig;
