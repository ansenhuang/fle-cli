var resolve = require('./utils').resolve;

var __DEV__ = (process.env.NODE_ENV || 'development') === 'development';
var __LOG__ = process.env.FLE_VCONSOLE === 'true';

module.exports = {
  dev: __DEV__,
  vconsole: __LOG__,
  fle: Object.assign({
    // global
    eslint: true,
    notify: true,
    inlineManifest: true,
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
  }, require(resolve('fle.json')))
};
