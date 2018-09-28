var fs = require('fs');
var path = require('path');
var merge = require('webpack-merge');
var config = require('./config');
var plugin = require('./plugin');
var { resolve, getPages } = require('./utils');

var lodash = require('lodash');
lodash.templateSettings.interpolate = /<%=([\s\S]+?)%>/g; // 设置模板变量匹配变量

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
  page.dev = true;

  if (!/\.ftl$/.test(page.template)) {
    if (page.template[0] === '/') {
      page.template = path.join(sharePath, 'template', page.template.substr(1));
    } else {
      page.template = resolve(page.template);
    }

    page.filename = page.filename || ('html/' + page.id + '.html');
  } else {
    page.template = resolve(page.template);

    if (config.fle.copyPath) {
      page.dev = false;
      page.filename = page.filename || 'ftl/' + page.id + '.ftl';
    } else {
      if (page.filename) {
        page.filename = page.filename.replace(/\.ftl$/, '.html');
      } else {
        page.filename = 'ftl/' + page.id + '.html';
      }
    }
  }

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
    path: config.fle.copyPath ? resolve(config.fle.copyPath) : resolve('.'),
    publicPath: config.fle.copyPath ? ((config.fle.https ? 'https:' : 'http:') + '//' + config.fle.host + ':' + config.fle.port + '/') : '/',
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].js'
  },
  plugins: [
    config.fle.hot && plugin.hmr(),
    config.vconsole && plugin.vconsole(),
    config.fle.copyPath && plugin.writeFile(),
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
      poll: true,
      ignored: /node_modules/
    }
  }
};

module.exports = merge(
  baseWebpackConfig,
  webpackConfig,
  fs.existsSync(userWebpackPath) ? require(userWebpackPath) : {}
);
