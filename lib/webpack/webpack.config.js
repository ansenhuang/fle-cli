var fs = require('fs');
var path = require('path');
var merge = require('webpack-merge');
var config = require('./config');
var loader = require('./loader');
var plugin = require('./plugin');
var html = require('./html');
var resolve = require('./utils').resolve;

//添加入口
var entries = {
  vendor: ['react', 'react-dom', 'prop-types']
};

// 如果手动定义了vendor
var useVendor = config.fle.vendorChunks && config.fle.vendorChunks.length;
if (useVendor) {
  entries['vendor'] = config.fle.vendorChunks;
}

html.pages.forEach(page => {
  entries[page.id] = page.entry;
});

//基本配置
var webpackConfig = {
  entry: entries,
  cache: true,
  devtool: config.dev ? 'cheap-module-eval-source-map' : false,
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

    (config.dev && config.fle.hot) && plugin.hmr(),
    (config.dev && config.vconsole) && plugin.vconsole(),
    config.dev && plugin.namedModules(),
    config.dev && plugin.noErrors(),
    config.dev && plugin.friendlyErrors(),

    !config.dev && plugin.merge(),
    !config.dev && plugin.hash(),
    !config.dev && plugin.optimizeCSS(),
    !config.dev && plugin.extractCSS(),
    !config.dev && plugin.scope(),
    !config.dev && plugin.commonsVendor(),
    !config.dev && plugin.commonsAsync(),
    (!config.dev && !useVendor) && plugin.commonsManifest(),
    (!config.dev && !useVendor && config.fle.inlineManifest) && plugin.inlineManifest(),
    !config.dev && plugin.uglify(),
    !config.dev && plugin.analyzer()
  ].filter(r => r).concat(html.htmlPlugins),
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
  externals: config.fle.externals,
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

if (config.dev) {
  webpackConfig.devServer = {
    host: config.fle.host,
    port: config.fle.port,
    contentBase: false,
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
  };
  webpackConfig.output = {
    publicPath: '/',
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].chunk.js'
  };
} else {
  webpackConfig.output = {
    path: resolve('dist'),
    publicPath: config.fle.publicPath,
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].chunk.[chunkhash:8].js'
  };
}

module.exports = merge(
  webpackConfig,
  // 项目工程若有自定义配置，则合并
  fs.existsSync(resolve('webpack.config.js')) ? require(resolve('webpack.config.js')) : {}
);
