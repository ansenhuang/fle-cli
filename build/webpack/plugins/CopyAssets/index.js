var copy = require('copy');

function CopyAssetsPlugin(patterns) {
  if (!Array.isArray(patterns)) {
    throw new Error('[copy-assets-plugin] patterns must be an array');
  }

  this.patterns = patterns;
}

CopyAssetsPlugin.prototype.apply = function (compiler) {
  compiler.hooks.afterEmit.tap('CopyAssets', () => {
    this.patterns.forEach((item) => {
      copy(item.from, item.to, (err) => {
        if (err) throw err;
      });
    });
  });
};

module.exports = CopyAssetsPlugin;
