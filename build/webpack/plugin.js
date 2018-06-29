var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var notifier = require('node-notifier');
var internalIp = require('internal-ip');
var color = require('@fle/color');

var config = require('./config');
var { resolve } = require('./utils');

var InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
var VconsolePlugin = require('vconsole-webpack-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
var UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var VueLoaderPlugin = require('vue-loader/lib/plugin');

// my
var NosUploadPlugin = require('./plugins/NosUpload');

// 这里将 Node 中使用的变量也传入到 Web 环境中，以方便使用
exports.define = () => {
  return new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(config.dev ? 'development' : 'production')
    }
  });
}

// 启用HMR
exports.hmr = () => {
  return new webpack.HotModuleReplacementPlugin();
}

// hash
exports.hash = () => {
  return new webpack.HashedModuleIdsPlugin();
}

//代码压缩插件
exports.uglify = () => {
  return new UglifyjsWebpackPlugin({
    exclude: /\.min\.js$/,
    cache: true,
    parallel: true,
    sourceMap: false,
    extractComments: false,
    uglifyOptions: {
      compress: {
        unused: true,
        warnings: false,
        drop_debugger: true
      },
      output: {
        comments: false
      }
    }
  });
}

// Merge chunks
exports.merge = () => {
  return new webpack.optimize.AggressiveMergingPlugin();
}

// 将manifest内联到html中，避免多发一次请求
exports.inlineManifest = () => {
  return new InlineManifestWebpackPlugin();
}

// 开启vconsole
exports.vconsole = () => {
  return new VconsolePlugin({
    enable: true
  });
}

// 优化控制台输出
exports.friendlyErrors = () => {
  var localIP = internalIp.v4.sync();

  return new FriendlyErrorsPlugin({
    compilationSuccessInfo: {
      messages: [
        'Local    ->  ' + color.cyan(`http://${config.fle.host}:${config.fle.port}/`),
        'Network  ->  ' + color.cyan(`http://${localIP}:${config.fle.port}/`)
      ]
    },
    onErrors: (severity, errors) => {
      if (!config.fle.notify) return;
      if (severity !== 'error') return;

      var error = errors[0];
      var filename = error.file && error.file.split('!').pop();

      notifier.notify({
        title: path.basename(resolve('.')),
        message: severity + ': ' + error.name,
        subtitle: filename || '',
        icon: path.join(__dirname, '../.share/images/logo.png')
      });
    }
  });
}

// 分离css文件
exports.extractCSS = (opt = {}) => {
  return new MiniCssExtractPlugin({
    filename: opt.filename || 'css/[name].[contenthash:8].css',
    chunkFilename: opt.chunkFilename || 'css/[name].[contenthash:8].css'
  });
}

// 优化css打包，避免重复打包
exports.optimizeCSS = () => {
  return new OptimizeCssAssetsPlugin({
    assetNameRegExp: /\.css$/g,
    cssProcessorOptions: {
      safe: true,
      autoprefixer: { disable: true },
      mergeLonghand: false,
      discardComments: {
        removeAll: true
      },
      autoprefixer: {
        browsers: config.fle.browsers
      }
    },
    canPrint: true
  });
}

// 模块依赖分析
exports.analyzer = (opt = {}) => {
  return new BundleAnalyzerPlugin({
    openAnalyzer: opt.open !== false,
    analyzerMode: 'static', // server, static
    reportFilename: opt.filename || 'report.html'
  });
}

var htmlDefaults = {
  title: 'fle-cli',
  keywords: '',
  description: '',
  icon: '',
  css: [],
  prejs: [],
  js: [],
  filename: 'html/404.html',
  template: path.join(__dirname, '../.share/template/default.html'),
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

exports.html = (opt = {}) => {
  return new HtmlWebpackPlugin(Object.assign({}, htmlDefaults, opt));
}

exports.vue = () => {
  return new VueLoaderPlugin();
}

// upload nos
exports.upload = (opt = {}) => {
  return new NosUploadPlugin({
    nosConfig: config.uploadConfig,
    distPath: opt.distPath || resolve('dist'),
    prefix: 'fle/a0df1d4009c7a2ec5fee/' + (config.fle.business || +new Date()) + '/',
    exclude: /(\.(html|ftl|ejs)$)/,
    // uploadDone: (values) => {
    //   /* item: success, filename, url */
    // }
  });
}
