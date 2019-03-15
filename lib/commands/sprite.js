var fs = require('fs');
var path = require('path');
var program = require('commander');
var color = require('@fle/color');
var sprites = require('../sprites');

program
  .usage('[glob] [options]')
  .option('--config    [file]', '使用配置文件')
  .option('--dest      [file]', '雪碧图的输出路径')
  .option('--padding   [num]', '雪碧图元素的间距')
  .option('--css-dest  [file]', 'CSS的输出路径')
  .option('--css-url   [file]', 'CSS中图片的url路径')
  .option('--css-unit  [unit]', 'CSS单位，默认px')
  .on('--help', () => {
    console.log('  支持png、jpg、jpeg格式');
  })
  .parse(process.argv);

var opts = program.opts();

function onSuccess (file) {
  console.log(color.green(file));
}

if (opts.config) {
  var file = path.resolve(opts.config);

  if (fs.existsSync(file)) {
    var config = require(file);
    Array.isArray(config) && sprites(config, onSuccess);
  } else {
    console.log(color.red('配置文件不存在'));
  }
} else if (program.args.length) {
  if (program.args.length === 1) {
    sprites({ src: program.args[0] }, onSuccess);
  } else {
    sprites({ src: program.args }, onSuccess);
  }
} else {
  console.log(color.red('请指定要合成雪碧图的图片'));
}
