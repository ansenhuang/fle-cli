var fs = require('fs');
var path = require('path');
var merge = require('webpack-merge');
var config = require('./config');
var plugin = require('./plugin');
var { resolve, getPages } = require('./utils');

var baseWebpackConfig = require('./webpack.base.config');
var userWebpackPath = resolve('webpack.dev.config.js');

var entry = {};
var htmlConfigs = [];
var pages = getPages(resolve('src'));
var sharePath = path.join(__dirname, '../.share');

if (config.compilePages.length) {
  pages = pages.filter(page => config.compilePages.indexOf(page.id) !== -1);
}

if (!pages.length) {
  console.log('没有可以编译的页面');
  process.exit(1);
}

pages.forEach(page => {
  entry[page.id] = page.entry;

  if (page.template) {
    if (page.template[0] === '/') {
      page.template = path.join(sharePath, 'template', page.template.substr(1));
    } else {
      page.template = resolve(page.template);
    }
  }

  var prefix = page.publicPath ? page.publicPath.replace(/^\//, '') : 'html/';
  page.filename = prefix + page.id + '.html';

  page.chunks = [page.id];

  page.css = [].concat(config.fle.css, page.css).filter(c => c);
  page.prejs = [].concat(config.fle.prejs, page.prejs).filter(c => c);
  page.js = [].concat(config.fle.js, page.js).filter(c => c);

  page.remUnit = config.fle.remUnit;
  page.uaId = ''; // 开发模式不统计pv

  htmlConfigs.push(page);
});

var htmls = [
  plugin.html({
    title: '页面导航',
    filename: 'index.html',
    template: path.join(sharePath, 'template/dev.html'),
    favicon: path.join(sharePath, 'images/favicon.ico'),
    pages: htmlConfigs
  })
].concat(htmlConfigs.map(config => plugin.html(config)));

//基本配置
var webpackConfig = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: entry,
  output: {
    publicPath: '/',
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].js'
  },
  plugins: [
    config.fle.hot && plugin.hmr(),
    config.vconsole && plugin.vconsole(),
    plugin.friendlyErrors()
  ].filter(r => r).concat(htmls),
  externals: config.fle.externals,
  devServer: {
    host: config.fle.host,
    port: config.fle.port,
    contentBase: false,
    proxy: config.fle.proxy,
    compress: true,
    hot: config.fle.hot,
    historyApiFallback: config.fle.historyApiFallback,
    open: config.fle.open,
    https: config.fle.https,
    publicPath: '/',
    quiet: true,
    inline: true,
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

module.exports = merge(
  baseWebpackConfig,
  webpackConfig,
  fs.existsSync(userWebpackPath) ? require(userWebpackPath) : {}
);
