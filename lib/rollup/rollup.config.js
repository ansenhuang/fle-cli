var config = require('./config');
var plugin = require('./plugin');
var resolve = require('./utils').resolve;

module.exports = {
  input: resolve('public/demo/index.js'),
  output: {
    file: resolve('public/dist/bundle.js'),
    format: 'iife',
    name: config.pkg.name.replace(/-/g, '_'),
    sourcemap: config.dev ? 'inline' : false,
    intro: (config.dev && config.vconsole) ? "(function(l, i, v, e) { v = l.createElement(i); v.src = '//res.wx.qq.com/mmbizwap/zh_CN/htmledition/js/vconsole/2.5.2/vconsole.min.js'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');" : ""
  },
  plugins: [
    plugin.progress(),
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
