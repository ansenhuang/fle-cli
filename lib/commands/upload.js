var fs = require('fs');
var path = require('path');
var program = require('commander');
var inquirer = require('inquirer');
var color = require('@fle/color');
var glob = require('glob');
var { fleHomePath } = require('../consts');
var NosUpload = require(path.join(fleHomePath, 'node_modules/@winman-f2e/nos-upload'));

program
  .usage('<file|glob> [options]')
	.option('-i, --init', '创建上传所需的密钥文件')
  .option('-m, --min', '开启压缩图片功能（jpg、jpeg、png）')
  .option('--unique [name]', '设置文件链接的唯一标识（名称、版本号）')
  .on('--help', () => {
    console.log();
  })
  .parse(process.argv);

var opts = program.opts();
var cdnFile = path.join(fleHomePath, '.cdn.json');
var isExistConfig = fs.existsSync(cdnFile);

if (!opts.init) {
  if (!isExistConfig) {
    console.log('未找到上传所需的密钥文件，请先创建：');
    console.log();
    console.log('  $ ' + color.cyan('fle upload --init'));
    console.log();

    process.exit(1);
  }

  var choices = [];
  var index = 1;

  program.args.forEach((file) => {
    var globFiles = glob.sync(file, { nodir: true });

    globFiles.forEach(f => {
      choices.push({
        name: f,
        value: f,
        short: index++,
        checked: true
      });
    });
  });

  if (choices.length === 0) {
    console.log(color.red('未找到需要上传的文件'));
    process.exit(1);
  }

  inquirer.prompt([
    {
      type: 'checkbox',
      name: 'files',
      message: '请检查需要上传的文件',
      choices: choices,
      validate (a) {
        return a.length ? true : `请选择文件`;
      }
    }
  ]).then(answers => {
    var nosConfig = require(cdnFile);
    var uniqueId = opts.unique || (+new Date());
    nosConfig.prefix = 'fle/a0df1d4009c7a2ec5fee/' + uniqueId + '/';
    var nosUpload = new NosUpload(nosConfig);
    var files = [];
    var imagemins = [];

    if (opts.min) {
      answers.files.map(file => {
        var info = {
          filepath: path.resolve(file),
          filename: file
        };

        if (/\.(png|jpe?g)(\?.*)?$/.test(file)) {
          imagemins.push(info);
        } else {
          files.push(info);
        }
      });
    } else {
      answers.files.map(file => {
        files.push({
          filepath: path.resolve(file),
          filename: file
        });
      });
    }

    if (files.length) {
      nosUpload.uploadMultiFile(files).then(values => {
        console.log();
        console.log('============== Upload Info ================');
        values.forEach(res => {
          if (res.success) {
            console.log(color.green.bold(res.url));
          } else {
            console.log(color.red.bold(res.message || '上传失败'));
          }
        });
        console.log('===========================================');
        console.log();
      }).catch(err => {
        console.log(err);
      });
    }

    if (imagemins.length) {
      nosUpload.uploadMultiImage(imagemins).then(values => {
        console.log();
        console.log('============= Image Min Info ==============');
        values.forEach(res => {
          if (res.success) {
            console.log(color.green.bold(res.url));
          } else {
            console.log(color.red.bold(res.message || '上传失败'));
          }
        });
        console.log('===========================================');
        console.log();
      }).catch(err => {
        console.log(err);
      });
    }
  }).catch(err => {
    console.log(err);
  });
} else {
  if (isExistConfig) {
    console.log(color.cyan('已存在配置文件，本次操作会更新配置'));
  }

  inquirer.prompt([
    {
      type: 'input',
      name: 'endPoint',
      message: 'endPoint',
      validate (s) {
        return s.trim() ? true : '不能为空';
      }
    },
    {
      type: 'input',
      name: 'accessId',
      message: 'accessId',
      validate (s) {
        return s.trim() ? true : '不能为空';
      }
    },{
      type: 'input',
      name: 'secretKey',
      message: 'secretKey',
      validate (s) {
        return s.trim() ? true : '不能为空';
      }
    },{
      type: 'input',
      name: 'domain',
      message: 'domain',
      validate (s) {
        return s.trim() ? true : '不能为空';
      }
    },{
      type: 'input',
      name: 'bucket',
      message: 'bucket',
      validate (s) {
        return s.trim() ? true : '不能为空';
      }
    }
  ]).then(answers => {
    fs.writeFileSync(cdnFile, JSON.stringify(answers, null, 2), { encoding: 'utf8' });
    console.log();
    console.log(color.green('密钥文件创建工程'));
  });
}
