var path = require('path');
var merge = require('webpack-merge');
var config = require('./config');
// var loader = require('./loader');
var plugin = require('./plugin');
var utils = require('../utils');

var tplPath = path.join(__dirname, '../.share/template');

var entry = {};
var htmls = [];
var pages = utils.getPages(utils.resolve('src'));

htmls.push(plugin.html({
  title: '页面导航',
  filename: 'index.html',
  template: path.join(tplPath, 'dev-index.html'),
  favicon: path.join(__dirname, '../.share/images/favicon.ico'),
  pages: pages
}));

pages.forEach(page => {
  entry[page.id] = page.entry;

  if (page.template) {
    if (page.template[0] === '/') {
      page.template = path.join(tplPath, page.template.substr(1));
    } else {
      page.template = utils.resolve(page.template);
    }
  }

  page.filename = 'html/' + page.id + '.html';
  page.chunks = [page.id];

  htmls.push(plugin.html(page));
});

//基本配置
var webpackConfig = {
  entry: entry,
  devtool: 'cheap-module-eval-source-map',
  output: {
    publicPath: '/',
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].chunk.js'
  },
  plugins: [
    config.dll && plugin.dllReference(),
    config.fle.hot && plugin.hmr(),
    config.vconsole && plugin.vconsole(),
    plugin.namedModules(),
    plugin.noErrors(),
    plugin.friendlyErrors()
  ].filter(r => r).concat(htmls),
  externals: config.fle.externals,
  devServer: {
    host: config.fle.host,
    port: config.fle.port,
    contentBase: utils.resolve('.cache/dll'),
    proxy: config.fle.proxy,
    compress: true,
    hot: config.fle.hot,
    historyApiFallback: true,
    open: config.fle.open,
    https: config.fle.https,
    quiet: true,
    // noInfo: true,
    // stats: 'errors-only',
    clientLogLevel: 'warning',
    disableHostCheck: true,
    overlay: true,
    watchOptions: {
      poll: true
    }
  }
};

module.exports = merge(webpackConfig, require('./webpack.base.config'));
