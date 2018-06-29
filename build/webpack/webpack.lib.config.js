var fs = require('fs');
var path = require('path');
var merge = require('webpack-merge');
var config = require('./config');
var plugin = require('./plugin');
var { resolve } = require('./utils');

var baseWebpackConfig = require('./webpack.base.config');
var userWebpackPath = resolve('webpack.lib.config.js');

var compileTypeMap = {
  'iife': 'self',
  'commonjs': 'commonjs2',
  'umd': 'umd2'
};

//基本配置
var webpackConfig = {
  mode: 'production',
  entry: {
    'index': resolve('src/common/index.js')
  },
  output: {
    path: resolve('lib'),
    libraryTarget: compileTypeMap[config.fle.compileType] || config.fle.compileType,
    // library: '[name]',
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  optimization: {
    minimizer: [
      plugin.uglify(),
      plugin.optimizeCSS()
    ]
  },
  plugins: [
    plugin.merge(),
    plugin.hash(),
    plugin.extractCSS({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    plugin.analyzer({
      filename: resolve('.cache/report/lib.html')
    })
  ],
  externals: config.fle.libExternals
};

module.exports = merge(
  baseWebpackConfig,
  webpackConfig,
  fs.existsSync(userWebpackPath) ? require(userWebpackPath) : {}
);
