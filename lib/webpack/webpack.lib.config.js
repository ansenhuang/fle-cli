var fs = require('fs');
var path = require('path');
var merge = require('webpack-merge');
var config = require('./config');
var loader = require('./loader');
var plugin = require('./plugin');
var html = require('./html');
var resolve = require('./utils').resolve;

//添加入口
var entries = {};
html.pages.forEach(page => {
  if (page.module) {
    entries[page.id] = page.module;
  }
});

//基本配置
var webpackConfig = {
  entry: entries,
  devtool: false,
  output: {
    path: resolve('lib'),
    libraryTarget: 'commonjs2',
    library: '[name]',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js'
  },
  resolve: {
    modules: [
      resolve('node_modules'),
      path.join(__dirname, '../../node_modules')
    ],
    extensions: ['.js', '.jsx', '.vue'],
    alias: {
      '@': resolve('src')
    }
  },
  resolveLoader: {
    modules: [
      path.join(__dirname, '../../node_modules'),
      resolve('node_modules')
    ]
  },
  //配置插件
  plugins: [
    plugin.define(),
    plugin.loader(),
    plugin.merge(),
    plugin.optimizeCSS(),
    plugin.extractCSS({
      filename: '[name].css'
    }),
    plugin.scope(),
    plugin.uglify(),
    plugin.analyzer({
      filename: 'report.html'
    })
  ].filter(r => r),
  module: {
    rules: [
      config.fle.eslint && loader.eslint(),
      loader.css(),
      loader.cssModules(),
      loader.vue(),
      loader.babel(),
      loader.text(),
      loader.images(),
      loader.fonts(),
      loader.medias()
    ].filter(r => r)
  },
  externals: config.fle.libExternals,
  target: 'web',
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
};

module.exports = merge(
  webpackConfig,
  // 项目工程若有自定义配置，则合并
  fs.existsSync(resolve('webpack.lib.config.js')) ? require(resolve('webpack.lib.config.js')) : {}
);
