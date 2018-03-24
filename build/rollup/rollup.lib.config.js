var config = require('./config');
var plugin = require('./plugin');
var resolve = require('../utils').resolve;

module.exports = {
  input: resolve('src/index.js'),
  output: !config.fle.iife ? [{
    file: resolve('lib/index.js'),
    format: 'cjs',
    exports: 'named',
    sourcemap: false,
    // 若需要导出css，则将编译的css文件自动引入
    intro: config.fle.extract ? "require('./style.css');" : ""
  }, {
    file: resolve('lib/index.esm.js'),
    format: 'es',
    exports: 'named',
    sourcemap: false,
    // 若需要导出css，则将编译的css文件自动引入
    intro: config.fle.extract ? "import './style.css';" : ""
  }] : {
    file: resolve('lib/index.js'),
    format: 'iife',
    name: config.pkg.name.replace(/[-\/@]/g, '_'),
    sourcemap: false
  },
  external: !config.fle.iife ? function (id) {
    return !!config.pkg.dependencies[id.split('/')[0]];
  } : undefined,
  plugins: [
    plugin.progress({
      clear: true
    }),
    plugin.replace(),
    config.fle.eslint && plugin.eslint(),
    plugin.alias(),
    config.fle.extract && plugin.postcss({
      filename: resolve('lib/style.css'),
      minify: config.fle.iife
    }),
    plugin.json(),
    plugin.nodeResolve(),
    plugin.commonjs(),
    plugin.babel(),
    config.fle.iife && plugin.babel(),
    config.fle.iife && plugin.uglify(),
    plugin.filesize()
  ].filter(p => p)
};
