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
  // name: 'vendor',
  // entry: vendors,
  devtool: false,
  output: {
    path: dllPath,
    filename: config.dev ? '[name].js' : '[name]_[hash:8].min.js',
    library: config.dev ? '[name]' : '[name]_[hash:8]'
  },
  plugins: [
    plugin.merge(),
    plugin.hash(),
    plugin.optimizeCSS(),
    plugin.extractCSS({
      filename: config.dev ? 'css/[name].css' : 'css/[name]_[contenthash:8].css'
    }),
    plugin.scope(),
    plugin.dll({
      manifestPath: dllPath
    }),
    !config.dev && plugin.uglify(),
    (!config.dev && config.upload) && plugin.upload({
      distPath: dllPath,
      dll: true
    }),
    // plugin.analyzer({
    //   filename: 'report.html'
    // })
  ].filter(p => p),
  externals: config.fle.externals
};

var mergeWebpackConfig = merge(
  baseWebpackConfig,
  webpackConfig,
  fs.existsSync(userWebpackPath) ? require(userWebpackPath) : {}
);

// 返回一个数组
module.exports = Object.keys(vendors).map(k => Object.assign({
  entry: {
    [k]: vendors[k]
  }
}, mergeWebpackConfig));
