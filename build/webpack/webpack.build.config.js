var fs = require('fs');
var path = require('path');
var merge = require('webpack-merge');
var config = require('./config');
var plugin = require('./plugin');
var { resolve, getPages } = require('./utils');

var baseWebpackConfig = require('./webpack.base.config');
var userWebpackPath = resolve('webpack.build.config.js');

var entry = {};
var htmls = [];
var vendors = [];
var pages = getPages(resolve('src'));
var sharePath = path.join(__dirname, '../.share');

if (config.compilePages.length) {
  config.fle.splitCommon = false; // 单独打包不抽离common
  pages = pages.filter(page => config.compilePages.indexOf(page.id) !== -1);
}

if (!pages.length) {
  console.log('没有可以编译的页面');
  process.exit(1);
}


if (config.fle.vendors && typeof config.fle.vendors === 'object') {
  Object.keys(config.fle.vendors).forEach(k => {
    entry[k + '_vendor'] = config.fle.vendors[k];
    vendors.push(k + '_vendor');
  });
}

if (!vendors.length && config.fle.splitCommon) {
  vendors = ['vendors'];
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

  page.chunks = [].concat(['runtime'], vendors, [page.id]);

  page.css = [].concat(config.fle.css, page.css).filter(c => c);
  page.prejs = [].concat(config.fle.prejs, page.prejs).filter(c => c);
  page.js = [].concat(config.fle.js, page.js).filter(c => c);

  page.remUnit = config.fle.remUnit;

  htmls.push(plugin.html(page));
});

var webpackConfig = {
  mode: 'production',
  entry: entry,
  output: {
    path: resolve('dist'),
    publicPath: config.fle.publicPath,
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].js'
  },
  optimization: {
    minimizer: [
      plugin.uglify(),
      plugin.optimizeCSS()
    ],
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /node_modules/,
          name: 'vendors',
          enforce: true,
          chunks: 'initial'
        },
        styles: {
          test: /\.css$/,
          name: 'styles',
          enforce: true,
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    plugin.merge(),
    plugin.hash(),
    plugin.extractCSS(),
    config.upload && plugin.upload(),
    plugin.analyzer({
      filename: '../.cache/report.build.html'
    })
  ].filter(r => r).concat(htmls),
  externals: config.fle.externals
};

if (config.fle.inlineManifest) {
  webpackConfig.plugins.push(plugin.inlineManifest());
}

module.exports = merge(
  baseWebpackConfig,
  webpackConfig,
  fs.existsSync(userWebpackPath) ? require(userWebpackPath) : {}
);
