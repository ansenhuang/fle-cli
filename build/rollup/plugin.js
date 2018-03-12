var path = require('path');
var config = require('./config');
var getCSSConfig = require('./postcss');
var resolve = require('../utils').resolve;

// plugins
var progress = require('rollup-plugin-progress');
var replace = require('rollup-plugin-replace');
var alias = require('rollup-plugin-alias');
var json = require('rollup-plugin-json');
var url = require('rollup-plugin-url');
var nodeResolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var eslint = require('rollup-plugin-eslint');
var babel = require('rollup-plugin-babel');
var uglify = require('rollup-plugin-uglify');
var filesize = require('rollup-plugin-filesize');
var postcss = require('rollup-plugin-postcss');
var serve = require('rollup-plugin-serve');
var livereload = require('rollup-plugin-livereload');

exports.progress = function (opt = {}) {
  return progress({
    clearLine: opt.clear || false
  });
};

exports.replace = function () {
  return replace({
    "process.env.NODE_ENV": JSON.stringify(config.dev ? 'development' : 'production'),
    "process.env.VERSION": JSON.stringify(config.pkg.version),
    "process.env.NAME": JSON.stringify(config.pkg.name)
  });
};

exports.alias = function () {
  return alias({
    resolve: ['.js', '/index.js'],
    '@': resolve('src')
  });
};

exports.json = function () {
  return json({
    exclude: resolve('node_modules/**'),
    preferConst: true
  });
};

exports.url = function (opt = {}) {
  return url({
    limit: 10000,
    emitFiles: true,
    publicPath: opt.publicPath || '',
    include: [
      "**/*.svg",
      "**/*.png",
      "**/*.jpg",
      "**/*.jpeg",
      "**/*.gif",
    ]
  });
};

exports.nodeResolve = function () {
  return nodeResolve();
};

exports.commonjs = function () {
  return commonjs();
};

exports.eslint = function () {
  return eslint({
    fix: false, // 因为这里不会自动将文件中不合法的代码fix
    throwOnError: !config.dev, // 生产环境发现代码不合法，则中断编译
    include: [resolve('src/**/*.js'), resolve('public/demo/**/*.js')],
    formatter: require('eslint-friendly-formatter'),
    baseConfig: {
      extends: [path.join(__dirname, './eslint.js')]
    }
  });
};

exports.babel = function () {
  return babel(Object.assign({
    // runtimeHelpers: true,
    externalHelpers: false,
    include: [resolve('src/**/*.js'), resolve('public/demo/**/*.js')]
  }, require('./babel.js')));
};

exports.uglify = function () {
  return uglify();
};

exports.filesize = function () {
  return filesize();
};

exports.postcss = function (opt = {}) {
  return postcss(getCSSConfig(opt));
};

exports.serve = function () {
  return serve({
    contentBase: resolve('public'),
    port: config.fle.port,
    host: config.fle.host,
    historyApiFallback: true
  });
};

exports.livereload = function () {
  return livereload({
    watch: resolve('public'),
    verbose: true, // Disable console output
    https: config.fle.https ? true : null // 看了源码，https==null才不开启，所以直接写false会开启https
  });
};
