var path = require('path');
var config = require('./config');
var loader = require('./loader');
var plugin = require('./plugin');
var { resolve } = require('./utils');

//基本配置
var webpackConfig = {
  // entry: {},
  cache: true,
  // devtool: false,
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
    noParse: [/\.min\.js$/],
    rules: [
      config.fle.eslint && loader.eslint(),
      loader.css(),
      loader.cssModules(),
      config.vue && loader.vue(),
      loader.babel(),
      loader.text(),
      loader.imagesOrigin(),
      loader.imagesMin(),
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
  target: 'web'
};

module.exports = webpackConfig;
