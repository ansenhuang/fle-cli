var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var config = require('./config');
var utils = require('./utils');

var pages = utils.getPages(utils.resolve('src'));
var templatePath = path.join(__dirname, '../template');
var imagesPath = path.join(__dirname, '../images');

//定义HTML文件入口
//遍历定义好的app进行构造
var defaults = {
  title: 'fle-cli',
  keywords: '',
  description: '',
  icon: '',
  css: config.fle.css || [],
  prejs: config.fle.prejs || [],
  js: config.fle.js || [],

  filename: 'html/404.html',
  template: path.join(templatePath, 'default.html'),
  inject: true,
  chunks: [],
  chunksSortMode: 'dependency',
  minify: config.dev ? null : {
    removeComments: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeStyleLinkTypeAttributes: true,
    keepClosingSlash: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true
  }
};

var htmlConfigs = pages.map(page => {
  if (page.template) {
    if (page.template[0] === '/') {
      page.template = path.join(templatePath, page.template.substr(1));
    } else {
      page.template = utils.resolve(page.template);
    }
  }

  page.filename = `html/${page.id}.html`;
  page.chunks = config.dev ? [page.id] : [!config.fle.inlineManifest && 'manifest', 'vendor', page.id].filter(c => c);

  return Object.assign({}, defaults, page);
});

var htmlPlugins = htmlConfigs.map(config => new HtmlWebpackPlugin(config));

if (config.dev) {
  htmlPlugins.unshift(new HtmlWebpackPlugin({
    title: '页面导航',
    filename: 'index.html',
    template: path.join(templatePath, 'dev-index.html'),
    favicon: path.join(imagesPath, 'favicon.ico'),
    inject: true,
    chunks: [],
    htmls: htmlConfigs
  }));
}

exports.pages = pages;
exports.htmlPlugins = htmlPlugins;
