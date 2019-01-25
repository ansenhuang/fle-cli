var fs = require('fs');
var path = require('path');
var merge = require('webpack-merge');
var config = require('./config');
var plugin = require('./plugin');
var { resolve, getPages } = require('./utils');

var lodash = require('lodash');
lodash.templateSettings.interpolate = /<%=([\s\S]+?)%>/g; // 设置模板变量匹配变量

var baseWebpackConfig = require('./webpack.base.config');
var userWebpackPath = resolve('webpack.build.config.js');

var entry = {};
var htmls = [];
var vendors = ['runtime'];
var pages = getPages(resolve('src'));
var sharePath = path.join(__dirname, '../.share');
var cacheGroups = {};

if (config.compilePages.length) {
  pages = pages.filter(page => config.compilePages.indexOf(page.id) !== -1);
}

if (!pages.length) {
  console.log('没有可以编译的页面');
  process.exit(1);
}

var vendorKeys = Object.keys(config.fle.vendors || {});

if (vendorKeys.length) {
  vendorKeys.forEach(k => {
    vendors.push(k + '_vendor');

    cacheGroups[k + '_vendor'] = {
      test: new RegExp(config.fle.vendors[k]),
      name: k + '_vendor',
      minSize: 30000,
      minChunks: 1,
      chunks: 'initial',
      priority: 2
    };
  });
}

if (config.fle.splitVendor) {
  vendors.push('vendors');

  cacheGroups['vendors'] = {
    test: /[\\/]node_modules[\\/]/,
    name: 'vendors',
    minSize: 30000,
    minChunks: 3,
    chunks: 'initial',
    priority: 1,
    reuseExistingChunk: true
  };
}

if (config.fle.splitCommon) {
  vendors.push('commons');

  cacheGroups['commons'] = {
    test: /[\\/]src[\\/]common[\\/]/,
    name: 'commons',
    minSize: 30000,
    minChunks: 3,
    chunks: 'initial',
    priority: -1,
    reuseExistingChunk: true
  };
}

pages.forEach(page => {
  entry[page.id] = page.entry;

  if (page.template[0] === '/') {
    page.template = path.join(sharePath, 'template', page.template.substr(1));
  } else {
    page.template = resolve(page.template);
  }

  if (!/\.ftl$/.test(page.template)) {
    page.filename = page.filename || ('html/' + page.id + '.html');
  } else {
    page.filename = page.filename || ('ftl/' + page.id + '.ftl');
  }

  if (config.upload) {
    page.filename = resolve('public/' + page.filename); // 改成绝对路径
  }

  page.chunks = [].concat(vendors, [page.id]);

  page.css = [].concat(config.fle.css, page.css).filter(c => c);
  page.prejs = [].concat(config.fle.prejs, page.prejs).filter(c => c);
  page.js = [].concat(config.fle.js, page.js).filter(c => c);

  page.remUnit = config.fle.remUnit;
  page.dev = false;

  htmls.push(plugin.html(page));
});

var distPath = !config.upload ? resolve('dist') : resolve('.cache/dist');

var webpackConfig = {
  mode: 'production',
  devtool: config.fle.sourceMap === true,
  entry: entry,
  output: {
    path: distPath,
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
      automaticNameDelimiter: '_',
      cacheGroups: cacheGroups
    }
  },
  plugins: [
    plugin.merge(),
    plugin.hash(),
    plugin.deepScope(),
    plugin.extractCSS(),
    config.upload && plugin.upload({
      distPath: distPath
    }),
    config.report && plugin.analyzer({
      filename: resolve('.cache/report/build.html')
    }),
    config.fle.copyPath && plugin.copy(config.fle.copyPath)
  ].filter(r => r).concat(htmls),
  externals: config.fle.externals
};

// inlineMinifest插件要在html插件之后
if (config.fle.inlineManifest) {
  webpackConfig.plugins.push(plugin.inlineManifest());
}

module.exports = merge(
  baseWebpackConfig,
  webpackConfig,
  fs.existsSync(userWebpackPath) ? require(userWebpackPath) : {}
);
