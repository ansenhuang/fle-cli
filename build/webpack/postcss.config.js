var config = require('./config');
var resolve = require('../utils').resolve;

module.exports = {
  plugins: [
    require('postcss-import')({
      path: resolve('node_modules')
    }),
    require('postcss-mixins')(),
    require('postcss-advanced-variables')(),
    require('postcss-color-function')(),
    require('postcss-nested')(),
    require('postcss-extend')(),
    require('postcss-calc')({
      mediaQueries: true,
      selectors: false
    }),
    require('postcss-plugin-px2rem')({
      rootValue: {
        rpx: config.fle.remUnit || 50
      }
    }),
    require('autoprefixer')({
      browsers: config.fle.browsers
    })
  ]
};
