var fs = require('fs');
var path = require('path');
var NosUpload = require('./upload');

// nosConfig
// {
//   endPoint,
//   accessId,
//   secretKey,
//   domain,
//   bucket,
//   business
// }
function NosPlugin ({
  nosConfig,
  include, // regexp
  exclude, // regexp
  saveFile
}) {
  this.nosUpload = new NosUpload(nosConfig);
  this.include = include;
  this.exclude = exclude;
}

NosPlugin.prototype.apply = function (compiler) {
  compiler.plugin('before-run', (compiler, callback) => {
    compiler.options.output.publicPath = this.nosUpload.domain + this.nosUpload.prefix + '/';
    callback && callback();
  });

  compiler.plugin('emit', (compilation, callback) => {
    var assets = compilation.assets;
    var promises = [];
    var tmpPath = path.join(process.env.HOME, '.fle/.tmp_upload');

    if (!fs.existsSync(tmpPath)) {
      fs.mkdirSync(tmpPath);
    }

    Object.keys(assets).forEach(key => {
      var ext = path.extname(key);

      if (this.exclude && this.exclude.test(key)) return;
      if (this.include && !this.include.test(key)) return;

      promises.push(
        this.nosUpload.uploadContent({
          content: assets[key].source(),
          filename: key,
          tmpPath: tmpPath
        })
      );

      !saveFile && delete assets[key];
    });

    Promise.all(promises).then(() => {
      callback && callback();

      fs.readdirSync(tmpPath).forEach(file => {
        fs.unlinkSync(path.join(tmpPath, file));
      });
      // fs.rmdirSync(tmpPath);
    }).catch(err => {});
  })
}

module.exports = NosPlugin