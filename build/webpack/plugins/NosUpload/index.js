var path = require('path');
var chalk = require('chalk');
var NosUpload = require('@winman-f2e/nos-upload');

function NosPlugin ({
  nosConfig,
  include, // regexp
  exclude, // regexp
  prefix,
  distPath = '.',
  uploadDone
}) {
  var keys = [
    'endPoint',
    'accessId',
    'secretKey',
    'domain',
    'bucket'
  ];

  if (nosConfig && keys.every(k => nosConfig[k])) {
    nosConfig.prefix = prefix;

    this.nosUpload = new NosUpload(nosConfig);
    this.include = include;
    this.exclude = exclude;
    this.distPath = distPath;
    this.uploadDone = uploadDone;
  } else {
    console.log('===========================================');
    console.log('There is no upload config or config is illegal!');
    console.log('===========================================');
    console.log();
  }
}

NosPlugin.prototype.apply = function (compiler) {
  if (!this.nosUpload) return;

  compiler.plugin('before-run', (compiler, callback) => {
    compiler.options.output.publicPath = this.nosUpload.domain + this.nosUpload.prefix;
    callback && callback();
  });

  compiler.plugin('after-emit', (compilation, callback) => {
    var assets = compilation.assets;
    var files = [];

    Object.keys(assets).forEach(key => {
      if (this.exclude && this.exclude.test(key)) return;
      if (this.include && !this.include.test(key)) return;

      files.push({
        filepath: path.join(this.distPath, key),
        filename: key
      });
    });

    this.nosUpload.uploadMultiFile(files).then(values => {
      callback && callback();
      this.uploadDone && this.uploadDone(values);

      console.log();
      console.log('============== Upload Info ================');
      values.forEach(res => {
        if (res.success) {
          console.log(chalk.green.bold(res.url));
        } else {
          console.log(chalk.red.bold(res.message || 'Upload failed!'));
        }
      });
      console.log('===========================================');
      console.log();
    });
  });
}

module.exports = NosPlugin