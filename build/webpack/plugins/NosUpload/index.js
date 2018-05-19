var path = require('path');
var NosUpload = require('@winman-f2e/nos-upload');
var color = require('@fle/color');

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
    console.log('\n上传密钥不存在或无效\n');
  }
}

NosPlugin.prototype.apply = function (compiler) {
  if (!this.nosUpload) return;

  compiler.hooks.beforeRun.tap('NosUpload', (compiler) => {
    compiler.options.output.publicPath = this.nosUpload.domain + this.nosUpload.prefix;
  });

  compiler.hooks.afterEmit.tap('NosUpload', (compilation) => {
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
      this.uploadDone && this.uploadDone(values);

      console.log();
      console.log('============== Upload Info ================');
      values.forEach(res => {
        if (res.success) {
          console.log(color.green(res.url));
        } else {
          console.log(color.red(res.message || '上传失败'));
        }
      });
      console.log('===========================================');
      console.log();
    });
  });
}

module.exports = NosPlugin
