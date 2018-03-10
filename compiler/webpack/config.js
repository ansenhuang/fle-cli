var resolve = require('./utils').resolve;

var __DEV__ = (process.env.NODE_ENV || 'development') === 'development';
var __LOG__ = process.env.FLE_VCONSOLE === 'true';
var __REACT__ = process.env.FLE_FRAMEWORK.indexOf('react') !== -1;
var __VUE__ = process.env.FLE_FRAMEWORK.indexOf('vue') !== -1;

var fle = require(resolve('fle.json'));
var commonsChunk = {};
var cdnCss = fle.css || [];
var cdnPrejs = [];
var cdnJs = []
var cdnExternals = {};

// 如果手动定义了commonsChunk
if (fle.commonsChunk) {
  var commons = fle.commonsChunk;

  if (typeof commons === 'string') {
    commonsChunk['common/vendor'] = commons;
  } else if (Array.isArray(commons)) {
    commonsChunk['common/vendor'] = commons;
  } else {
    Object.keys(commons).forEach(k => {
      commonsChunk['common/' + k] = commons[k];
    });
  }
}

if (Array.isArray(fle.prejs)) {
  fle.prejs.forEach(item => {
    if (typeof item === 'string') {
      cdnPrejs.push(item);
    } else {
      cdnPrejs.push(item.src);
      cdnExternals[item.name] = item.value;
    }
  });
}

if (Array.isArray(fle.js)) {
  fle.js.forEach(item => {
    if (typeof item === 'string') {
      cdnJs.push(item);
    } else {
      cdnJs.push(item.src);
      cdnExternals[item.name] = item.value;
    }
  });
}

module.exports = {
  dev: __DEV__,
  vconsole: __LOG__,
  react: __REACT__,
  vue: __VUE__,
  commonsChunk: commonsChunk,
  cdnExternals: cdnExternals,
  cdnCss: cdnCss,
  cdnPrejs: cdnPrejs,
  cdnJs: cdnJs,

  fle: Object.assign({
    // global
    eslint: true,
    notify: true,
    inlineManifest: true,
    // commonsChunk: null, // 手动抽离公共模块
    publicPath: '/',

    // css
    postcss: true,
    remUnit: 50,

    // dev
    host: 'localhost',
    port: 5000,
    proxy: {},
    hot: true,
    open: false,
    https: false,

    // cdn
    // css: [],
    // prejs: [],
    // js: [],

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
