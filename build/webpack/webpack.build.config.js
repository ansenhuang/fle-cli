var fs = require('fs');
var path = require('path');
var merge = require('webpack-merge');
var config = require('./config');
// var loader = require('./loader');
var plugin = require('./plugin');
var utils = require('../utils');

var baseWebpackConfig = require('./webpack.base.config');
var userWebpackPath = utils.resolve('webpack.build.config.js');

var entry = {};
var htmls = [];
var manifests = [];
var dlljs = [];
var pages = utils.getPages(utils.resolve('src'));
var sharePath = path.join(__dirname, '../.share');

// dll
if (config.fle.vendors && typeof config.fle.vendors === 'object') {
  Object.keys(config.fle.vendors).forEach(k => {
    var filePath = utils.resolve(`dist/dll/${k}.manifest.json`);
    if (fs.existsSync(filePath)) {
      manifests.push(plugin.dllReference({
        manifest: filePath
      }));

      if (!config.upload) {
        dlljs.push(config.fle.publicPath + 'dll/' + require(filePath).name + '.js');
      } else {
        if (config.fle.dllUpload && config.fle.dllUpload[k]) {
          dlljs.push(config.fle.dllUpload[k]);
        } else {
          console.log(`The vendors of [${k}] has no url, Please run "fle dll --build --upload" firstly!`);
        }
      }
    } else {
      console.log(`The vendors of [${k}] has no dll manifest, Please run "fle dll --build" firstly!`);
    }
  });
}

var commons = ['common'];
if (!config.fle.inlineManifest) {
  commons.unshift('manifest');
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

  page.filename = 'html/' + page.id + '.html';
  page.chunks = commons.concat([page.id]);

  page.css = [].concat(config.fle.css, page.css).filter(c => c);
  page.prejs = [].concat(config.fle.prejs, page.prejs).filter(c => c);
  page.js = [].concat(config.fle.js, page.js, dlljs).filter(c => c);

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
    plugin.commonsChunk(),
    plugin.commonsManifest(),
    (config.fle.inlineManifest) && plugin.inlineManifest(),
    plugin.commonsAsync(),
    plugin.uglify({
      exclude: /\.min\.js$/
    }),
    config.upload && plugin.upload(),
    plugin.analyzer()
  ].filter(r => r).concat(manifests, htmls),
  externals: config.fle.externals
};

module.exports = merge(
  baseWebpackConfig,
  webpackConfig,
  fs.existsSync(userWebpackPath) ? require(userWebpackPath) : {}
);
