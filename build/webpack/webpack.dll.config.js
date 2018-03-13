// var path = require('path');
var merge = require('webpack-merge');
var config = require('./config');
// var loader = require('./loader');
var plugin = require('./plugin');
var resolve = require('../utils').resolve;

var dependencies = require(resolve('package.json')).dependencies || {};

//基本配置
var webpackConfig = {
  name: 'vendor',
  entry: Object.keys(dependencies),
  devtool: 'cheap-module-eval-source-map',
  output: {
    path: resolve('.cache/dll'),
    filename: 'dll-vendor.js',
    library: 'vendor_[hash]'
  },
  plugins: [
    plugin.dll()
  ],
  externals: config.fle.externals
};

module.exports = merge(webpackConfig, require('./webpack.base.config'));
