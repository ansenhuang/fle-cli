var fs = require('fs');
var merge = require('webpack-merge');
var config = require('./config');
// var loader = require('./loader');
var plugin = require('./plugin');
var resolve = require('../utils').resolve;

var vendors = config.fle.vendors;

if (!vendors || Object.keys(vendors).length === 0) {
  console.log();
  console.log('There is no vendors in fle.json to build.');
  console.log();

  process.exit(1);
}

var baseWebpackConfig = require('./webpack.base.config');
var userWebpackPath = resolve('webpack.dll.config.js');
var dllPath = resolve(config.dev ? '.cache/devDll' : 'dist/dll');

//基本配置
var webpackConfig = {
  name: 'vendor',
  entry: vendors,
  devtool: false,
  output: {
    path: dllPath,
    filename: '[name].[hash:8].js',
    library: '[name].[hash:8]'
  },
  plugins: [
    plugin.merge(),
    plugin.hash(),
    plugin.optimizeCSS(),
    plugin.extractCSS({
      filename: 'css/[name].css'
    }),
    plugin.scope(),
    plugin.dll({
      manifestPath: dllPath
    }),
    !config.dev && plugin.uglify(),
    (!config.dev && config.upload) && plugin.upload(),
    plugin.analyzer({
      filename: 'report.html'
    })
  ].filter(p => p),
  externals: config.fle.externals
};

module.exports = merge(
  baseWebpackConfig,
  webpackConfig,
  fs.existsSync(userWebpackPath) ? require(userWebpackPath) : {}
);
