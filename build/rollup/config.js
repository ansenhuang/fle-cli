var resolve = require('../utils').resolve;

var __DEV__ = (process.env.NODE_ENV || 'development') === 'development';
var __LOG__ = process.env.FLE_VCONSOLE === 'true';

module.exports = {
  dev: __DEV__,
  vconsole: __LOG__,
  pkg: Object.assign({
    name: 'fle-boilerplate-lib',
    version: '0.0.1',
    dependencies: {}
  }, require(resolve('package.json'))),
  fle: Object.assign({
    eslint: true,
    iife: false,
    host: '0.0.0.0',
    port: 5000,
    hot: true,
    https: false,
    extract: false,
    remUnit: 50,
    browsers: [
      'last 4 versions',
      'ie >= 9',
      'iOS >= 7',
      'Android >= 4'
    ]
  }, require(resolve('fle.json')))
};
