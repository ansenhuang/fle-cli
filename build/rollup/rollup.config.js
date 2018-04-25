var fs = require('fs');
var config = require('./config');
var plugin = require('./plugin');
var resolve = require('../utils').resolve;
var vconsoleCode = fs.readFileSync(require.resolve('vconsole'), { encoding: 'utf8' });

module.exports = {
  input: resolve('public/demo/index.js'),
  output: {
    file: resolve('public/dist/bundle.js'),
    format: 'iife',
    name: config.pkg.name.replace(/[-\/@]/g, '_'),
    sourcemap: config.dev ? 'inline' : false,
    banner: (config.dev && config.vconsole) ? vconsoleCode + 'new VConsole();' : ''
  },
  plugins: [
    plugin.progress({
      clear: true
    }),
    plugin.replace(),
    config.fle.eslint && plugin.eslint(),
    plugin.alias(),
    plugin.postcss({
      filename: resolve('public/dist/style.css'),
      minify: !config.dev
    }),
    plugin.json(),
    plugin.url({
      publicPath: './dist/'
    }),
    plugin.nodeResolve(),
    plugin.commonjs(),
    plugin.babel(),
    config.dev && plugin.serve(),
    (config.dev && config.fle.hot) && plugin.livereload(),
    !config.dev && plugin.uglify(),
    !config.dev && plugin.filesize()
  ].filter(p => p)
};
