var path = require('path');
var merge = require('webpack-merge');
var config = require('./config');
var loader = require('./loader');
var plugin = require('./plugin');
var utils = require('../utils');

var tplPath = path.join(__dirname, '../.share/template');

var entry = config.fle.commonsChunk;
var htmls = [];

var commons = Object.keys(entry);
if (!config.fle.inlineManifest) {
  commons.unshift('manifest');
}

utils.getPages(utils.resolve('src')).forEach(page => {
  entry[page.id] = page.entry;

  if (page.template) {
    if (page.template[0] === '/') {
      page.template = path.join(tplPath, page.template.substr(1));
    } else {
      page.template = utils.resolve(page.template);
    }
  }

  page.filename = 'html/' + page.id + '.html';
  page.chunks = ['common/_base'].concat(commons, [page.id]);

  htmls.push(plugin.html(page));
});

var webpackConfig = {
  entry: entry,
  output: {
    path: utils.resolve('dist'),
    publicPath: config.fle.publicPath,
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].chunk.[chunkhash:8].js'
  },
  plugins: [
    plugin.merge(),
    plugin.hash(),
    plugin.optimizeCSS(),
    plugin.extractCSS(),
    plugin.scope(),
    plugin.commonsChunk({ commons: commons }),
    plugin.commonsAsync(),
    plugin.commonsManifest(),
    (config.fle.inlineManifest) && plugin.inlineManifest(),
    plugin.uglify(),
    plugin.analyzer()
  ].filter(r => r).concat(htmls),
  externals: config.fle.externals
};

module.exports = merge(webpackConfig, require('./webpack.base.config'));
