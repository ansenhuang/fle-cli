var config = require('./config');
var resolve = require('../utils').resolve;

module.exports = function ({
  filename,
  minify,
}) {
  var cssExportMap = {};

  return {
    extract: filename,
    extensions: ['.css'],
    sourceMap: config.dev ? 'inline' : false,
    getExport (id) {
      return cssExportMap[id] || {};
    },
    plugins: [
      require('postcss-import')({
        path: [resolve('node_modules')]
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
      require('postcss-modules')({
        generateScopedName: '[local]___[hash:base64:8]',
        // .module.css 启用css-modules
        globalModulePaths: [/\/node_modules\//, /^(?!.*\.module\.)/],
        getJSON (id, exportTokens) {
          const cssExportMapItem = {};
          Object.keys(exportTokens).forEach(key => {
            const upperKey = key.replace(/-(\w)/g, ($, $1) => $1.toUpperCase());
            cssExportMapItem[upperKey] = exportTokens[key];
          });
          cssExportMap[id] = cssExportMapItem;
        }
      }),
      require('autoprefixer')({
        browsers: config.fle.browsers
      }),
      minify && require('postcss-csso')()
    ].filter(p => p)
  };
}
