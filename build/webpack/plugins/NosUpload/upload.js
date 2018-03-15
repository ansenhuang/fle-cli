var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var NosClient = require('nos-node-sdk');

// getHash('fle_upload')
var fleHash = 'a0df1d4009c7a2ec5fee';

function getHash (data, len = 20) {
  var hash = crypto.createHash('sha256').update(data);
  return hash.digest('hex').substr(0, len);
}

// export
function NosUpload ({
  endPoint,
  accessId,
  secretKey,
  domain,
  bucket,
  business
}) {
  this.nosClient = new NosClient();
  this.nosClient.setProtocol('https');
	this.nosClient.setPort('443');
  this.nosClient.setEndpoint(endPoint);
  this.nosClient.setAccessId(accessId);
  this.nosClient.setSecretKey(secretKey);

  this.domain = /\/$/.test(domain) ? domain : domain + '/';
  this.bucket = bucket;
  this.prefix = ['fle', fleHash, business || +new Date()].join('/') + '/';
}

NosUpload.prototype.uploadFile = function ({
  filepath,
  filename = path.basename(filepath)
}) {
  return new Promise((resolve, reject) => {
    var stats = fs.statSync(filepath);

    if (stats.isFile()) {
      var config = {
        filepath: filepath,
        bucket: this.bucket,
        key: this.prefix + filename,
        cacheControl: 'public, max-age=31104000'
      };

      this.nosClient.put_file(config, res => {
        if (res.statusCode === 200) {
          resolve({
            success: true,
            filename: filename,
            url: this.domain + config.key
          });
        } else {
          reject({
            success: false,
            filename: filename,
            message: filename + ' upload failed.'
          })
        }
      });
    } else {
      reject({
        success: false,
        filename: filename,
        message: filename + ' is not a file.'
      })
    }
  });
}

NosUpload.prototype.uploadContent = function ({
  content,
  filename,
  tmpPath = '.'
}) {
  var tmpFile = path.join(tmpPath, filename.replace(/\//g, '__'));
  fs.writeFileSync(tmpFile, content || '', { encoding: 'utf8' });

  return new Promise((resolve, reject) => {
    this.uploadFile({
      filepath: tmpFile,
      filename: filename
    }).then(res => {
      resolve(res);
    }, res => {
      reject(res);
    });
  });
}

module.exports = NosUpload;