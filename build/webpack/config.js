var path = require('path');

var __DEV__ = (process.env.NODE_ENV || 'development') === 'development';
var __LOG__ = process.env.FLE_VCONSOLE === 'true';
var __UPLOAD__ = process.env.FLE_UPLOAD === 'true';
var __REPORT__ = process.env.FLE_REPORT === 'true';
var __COMPILE_PAGES__ = process.env.FLE_COMPILE_PAGES;
var __PORT__ = process.env.FLE_PORT;

var { resolve } = require('./utils');
var fle = require(resolve('fle.json'));
var __REACT__ = fle.boilerplate.indexOf('react') !== -1 || (fle.boilerplate === 'lib' && fle.react);
var __VUE__ = fle.boilerplate.indexOf('vue') !== -1 || (fle.boilerplate === 'lib' && fle.vue);
var uploadConfig = __UPLOAD__ ? require(path.join(__dirname, '../../.cdn.json')) : null;

if (__PORT__) {
  fle.port = __PORT__;
}

if (!fle.externals) {
  fle.externals = {};
}

if (Array.isArray(fle.prejs)) {
  fle.prejs.forEach((item, i) => {
    if (typeof item !== 'string') {
      fle.externals[item.name] = item.value;
      fle.prejs[i] = item.src;
    }
  });
}

if (Array.isArray(fle.js)) {
  fle.js.forEach((item, i) => {
    if (typeof item !== 'string') {
      fle.externals[item.name] = item.value;
      fle.js[i] = item.src;
    }
  });
}

module.exports = {
  dev: __DEV__,
  vconsole: __LOG__,
  upload: __UPLOAD__,
  report: __REPORT__,
  react: __REACT__,
  vue: __VUE__,
  uploadConfig: uploadConfig,
  compilePages: __COMPILE_PAGES__ ? __COMPILE_PAGES__.split(',') : [],
  fle: Object.assign({
    // global
    eslint: true,
    notify: true,
    inlineManifest: true,
    // vendors: {},
    // business: '',
    publicPath: '/',

    // css
    remUnit: 50,

    // dev
    host: '0.0.0.0',
    port: 5000,
    proxy: {},
    historyApiFallback: true,
    hot: true,
    open: false,
    https: false,

    // cdn
    css: [],
    prejs: [],
    js: [],

    // others
    browsers: [
      'last 4 versions',
      'ie >= 9',
      'iOS >= 7',
      'Android >= 4'
    ],
    externals: {},
    libExternals: {}
  }, fle)
};
