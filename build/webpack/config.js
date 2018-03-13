var __DEV__ = (process.env.NODE_ENV || 'development') === 'development';
var __LOG__ = process.env.FLE_VCONSOLE === 'true';
var __DLL__ = process.env.FLE_DLL_REFERENCE === 'true';
var __REACT__ = process.env.FLE_FRAMEWORK.indexOf('react') !== -1;
var __VUE__ = process.env.FLE_FRAMEWORK.indexOf('vue') !== -1;

var resolve = require('../utils').resolve;

var fle = require(resolve('fle.json'));
var commonsChunk = {};
var externals = {};

// 如果手动定义了commonsChunk
if (fle.commonsChunk) {
  var commons = fle.commonsChunk;

  if (typeof commons === 'string' || Array.isArray(commons)) {
    commonsChunk['common/vendor'] = commons;
  } else {
    Object.keys(commons).forEach(k => {
      commonsChunk['common/' + k] = commons[k];
    });
  }
}

if (Array.isArray(fle.prejs)) {
  fle.prejs.forEach((item, i) => {
    if (typeof item !== 'string') {
      externals[item.name] = item.value;
      fle.prejs[i] = item.src;
    }
  });
}

if (Array.isArray(fle.js)) {
  fle.js.forEach((item, i) => {
    if (typeof item !== 'string') {
      externals[item.name] = item.value;
      fle.js[i] = item.src;
    }
  });
}

if (__DEV__ && __DLL__) {
  fle.js = (fle.js || []).concat(['/dll-vendor.js']);
}

fle.commonsChunk = commonsChunk;
fle.externals = Object.assign(externals, fle.externals);

module.exports = {
  dev: __DEV__,
  vconsole: __LOG__,
  dll: __DLL__,
  react: __REACT__,
  vue: __VUE__,
  fle: Object.assign({
    // global
    eslint: true,
    notify: true,
    inlineManifest: true,
    commonsChunk: {}, // 手动抽离公共模块
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
