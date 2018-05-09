var fs = require('fs');
var path = require('path');
var merge = require('webpack-merge');
var config = require('./config');
// var loader = require('./loader');
var plugin = require('./plugin');
var utils = require('../utils');

var baseWebpackConfig = require('./webpack.base.config');
var userWebpackPath = utils.resolve('webpack.dev.config.js');

var entry = {};
var htmlConfigs = [];
var manifests = [];
var dlljs = [];
var pages = utils.getPages(utils.resolve('src'));
var sharePath = path.join(__dirname, '../.share');
var shouldBuildDll = false;

if (config.compilePages.length) {
  config.fle.splitCommon = false; // 单独打包不抽离common
  pages = pages.filter(page => config.compilePages.indexOf(page.id) !== -1);
}

if (!pages.length) {
  console.log('There are no page to compile!');
  process.exit(1);
}

// dll
if (config.fle.vendors && typeof config.fle.vendors === 'object') {
  Object.keys(config.fle.vendors).forEach(k => {
    var filePath = utils.resolve(`.cache/devDll/${k}.manifest.json`);
    if (fs.existsSync(filePath)) {
      manifests.push(plugin.dllReference({
        manifest: filePath
      }));
      dlljs.push('/' + k + '.js');
    } else {
      shouldBuildDll = true;
      console.log(`The vendors of [${k}] has no dll manifest, Please run "fle dll --dev" firstly!`);
    }
  });
}

if (shouldBuildDll) {
  process.exit(1);
}

pages.forEach(page => {
  entry[page.id] = page.entry;

  if (page.template) {
    if (page.template[0] === '/') {
      page.template = path.join(sharePath, 'template', page.template.substr(1));
    } else {
      page.template = utils.resolve(page.template);
    }
  }

  var prefix = page.publicPath ? page.publicPath.replace(/^\//, '') : 'html/';
  page.filename = prefix + page.id + '.html';

  page.chunks = [page.id];

  page.css = [].concat(config.fle.css, page.css).filter(c => c);
  page.prejs = [].concat(config.fle.prejs, page.prejs).filter(c => c);
  page.js = [].concat(config.fle.js, page.js, dlljs).filter(c => c);

  page.remUnit = config.fle.remUnit;

  htmlConfigs.push(page);
});

var guideHtml = plugin.html({
  title: '页面导航',
  filename: 'index.html',
  template: path.join(sharePath, 'template/dev.html'),
  favicon: path.join(sharePath, 'images/favicon.ico'),
  pages: htmlConfigs
})

var htmls = [guideHtml].concat(htmlConfigs.map(config => plugin.html(config)));

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
    config.fle.hot && plugin.hmr(),
    config.vconsole && plugin.vconsole(),
    plugin.namedModules(),
    plugin.noErrors(),
    plugin.friendlyErrors()
  ].filter(r => r).concat(manifests, htmls),
  externals: config.fle.externals,
  devServer: {
    host: config.fle.host,
    port: config.fle.port,
    contentBase: utils.resolve('.cache/devDll'),
    proxy: config.fle.proxy,
    compress: true,
    hot: config.fle.hot,
    historyApiFallback: config.fle.historyApiFallback,
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

module.exports = merge(
  baseWebpackConfig,
  webpackConfig,
  fs.existsSync(userWebpackPath) ? require(userWebpackPath) : {}
);
