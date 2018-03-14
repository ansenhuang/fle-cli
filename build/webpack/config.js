var __DEV__ = (process.env.NODE_ENV || 'development') === 'development';
var __LOG__ = process.env.FLE_VCONSOLE === 'true';
var __UPLOAD__ = process.env.FLE_UPLOAD === 'true';
var __REACT__ = process.env.FLE_FRAMEWORK.indexOf('react') !== -1;
var __VUE__ = process.env.FLE_FRAMEWORK.indexOf('vue') !== -1;

var resolve = require('../utils').resolve;
var fle = require(resolve('fle.json'));

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
  react: __REACT__,
  vue: __VUE__,
  fle: Object.assign({
    // global
    eslint: true,
    notify: true,
    inlineManifest: true,
    vendors: null,
    publicPath: '/',

    // css
    remUnit: 50,

    // dev
    host: 'localhost',
    port: 5000,
    proxy: {},
    hot: true,
    open: false,
    https: false,

    // cdn
    css: [],
    prejs: [],
    js: [],

    // others
    browsers: [
      'last 2 versions',
      'ie >= 9',
      'ios >= 7',
      'android >= 4'
    ],
    externals: {},
    libExternals: {}
  }, fle)
};
