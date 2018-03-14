var path = require('path');
var chalk = require('chalk');
var NosUpload = require('./upload');

function NosPlugin ({
  nosConfig,
  include, // regexp
  exclude, // regexp
  distPath = '.',
  uploadDone
}) {
  var keys = [
    'endPoint',
    'accessId',
    'secretKey',
    'domain',
    'bucket',
    // 'business'
  ];

  if (nosConfig && keys.every(k => nosConfig[k])) {
    this.nosUpload = new NosUpload(nosConfig);
    this.include = include;
    this.exclude = exclude;
    this.distPath = distPath;
    this.uploadDone = uploadDone;
  }
}

NosPlugin.prototype.apply = function (compiler) {
  if (!this.nosUpload) return;

  compiler.plugin('before-run', (compiler, callback) => {
    compiler.options.output.publicPath = this.nosUpload.domain + this.nosUpload.prefix + '/';
    callback && callback();
  });

  compiler.plugin('after-emit', (compilation, callback) => {
    var assets = compilation.assets;
    var promises = [];

    Object.keys(assets).forEach(key => {
      if (this.exclude && this.exclude.test(key)) return;
      if (this.include && !this.include.test(key)) return;

      promises.push(
        this.nosUpload.uploadFile({
          filepath: path.join(this.distPath, key),
          filename: key
        })
      );
    });

    Promise.all(promises).then((values) => {
      callback && callback();

      console.log('============== Upload Info ================');
      Object.keys(values).forEach(res => {
        if (res.code === 200) {
          console.log('  ' + chalk.green(res.filename));
        } else {
          console.log('  ' + chalk.red(res.message || 'Upload failed!'));
        }
      });
      console.log('===========================================');

      this.uploadDone && this.uploadDone(values);
    }).catch(err => {
      console.log(err);
    });
  })
}

module.exports = NosPlugin