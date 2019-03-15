var fs = require('fs');
var path = require('path');
var glob = require('glob');
var Spritesmith = require('spritesmith');

var id = 1;

function getShareCss (o) {
  return (
`.${o.name} {
  background-image: url(${o.url});
  background-repeat: no-repeat;
  background-size: ${o.sizeWidth}${o.unit} ${o.sizeHeight}${o.unit};
}
`
  );
}

function getSpriteCss (o) {
  return (
`.${o.name} {
  width: ${o.width}${o.unit};
  height: ${o.height}${o.unit};
  background-position: ${o.x}${o.unit} ${o.y}${o.unit};
}
`
  );
}

/**
 * 生成雪碧图及css
 * @param {array} list
 *    list.src     需要生成雪碧图的图片源，支持glob查找
 *    list.dest    雪碧图的输出位置
 *    list.padding 合成图片的间距，默认0
 *    list.cssDest css的输出位置，默认和dest相同位置
 *    list.cssUrl  css中url的定义，默认dest定义的位置
 *    list.cssUnit css中的像素单位，默认px
 * @param {function} success(file)
 */
module.exports = function (list, success) {
  if (!Array.isArray(list)) {
    list = [list];
  }

  list.forEach(item => {
    if (typeof item === 'string' || Array.isArray(item)) {
      item = { src: item };
    }

    // 只支持png,jpg,jpeg
    var files = (typeof item.src === 'string' ? glob.sync(item.src) : item.src).filter(file => /\.(png|jpe?g)(\?.*)?$/.test(file));

    if (!files.length) return;

    Spritesmith.run({
      src: files,
      padding: item.padding || 0
    }, (err, result) => {
      if (err) {
        console.error(err);
        return;
      }

      // result.image; // Buffer representation of image
      // result.coordinates; // Object mapping filename to {x, y, width, height} of image
      // result.properties; // Object with metadata about spritesheet {width, height}

      var dest = item.dest || ('sprites-' + (id++) + '.png');
      var cssDest = item.cssDest || dest.replace(/\.png$/, '.css');
      var cssUnit = item.cssUnit || 'px';
      var shareNames = path.basename(dest).split('.');
      shareNames.splice(-1, 1);

      var styles = [
        getShareCss({
          name: shareNames.join('_'),
          url: item.cssUrl || dest,
          sizeWidth: result.properties.width,
          sizeHeight: result.properties.height,
          unit: cssUnit
        })
      ];

      Object.keys(result.coordinates).forEach((key, index) => {
        var data = result.coordinates[key];
        var names = path.basename(key).split('.');
        names.splice(-1, 1, index + 1);

        var cssData = {
          name: 'sprite-' + names.join('_'),
          x: data.x,
          y: data.y,
          width: data.width,
          height: data.height,
          unit: cssUnit
        };
        styles.push(getSpriteCss(cssData));
      });


      fs.writeFileSync(dest, result.image);
      success && success(dest);

      fs.writeFileSync(cssDest, styles.join('\n'));
      success && success(cssDest);
    });
  });
}
