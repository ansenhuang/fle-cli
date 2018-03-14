var fs = require('fs');
var path = require('path');
var merge = require('webpack-merge');
var config = require('./config');
// var loader = require('./loader');
var plugin = require('./plugin');
var utils = require('../utils');

var baseWebpackConfig = require('./webpack.base.config');
var userWebpackPath = utils.resolve('webpack.lib.config.js');

var entry = {};
var pages = utils.getPages(utils.resolve('src'));

pages.forEach(page => {
  if (page.module) {
    entry[page.moduleName || page.id] = page.module;
  }
});

//基本配置
var webpackConfig = {
  entry: entry,
  output: {
    path: utils.resolve('lib'),
    libraryTarget: 'commonjs2',
    library: '[name]',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js'
  },
  plugins: [
    plugin.merge(),
    plugin.hash(),
    plugin.optimizeCSS(),
    plugin.extractCSS({
      filename: 'css/[name].css'
    }),
    plugin.scope(),
    plugin.uglify(),
    plugin.analyzer({
      filename: 'report.html'
    })
  ],
  externals: config.fle.libExternals
};

module.exports = merge(
  baseWebpackConfig,
  webpackConfig,
  fs.existsSync(userWebpackPath) ? require(userWebpackPath) : {}
);
