#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var program = require('commander');
var inquirer = require('inquirer');
var chalk = require('chalk');
var glob = require('glob');
var consts = require('../lib/consts');
// var utils = require('../lib/utils');
var NosUpload = require(path.join(consts.homeFlePath, 'node_modules/@winman-f2e/nos-upload'));

program
  .usage('<file|glob>')
	.option('-i, --init', 'configure your accessId and secretKey only once before upload')
	.option('-m, --min', 'optimize images of [jpg|jpeg|png] with imagemin')
  .on('--help', () => {
    console.log();
  })
  .parse(process.argv);

var opts = program.opts();
var cdnFile = path.join(consts.homeFlePath, '.cdn.json');
var isExistConfig = fs.existsSync(cdnFile);

if (opts.init) {
  if (isExistConfig) {
    console.log(chalk.cyan('There is already exist a config and it will be update!'));
  }

  inquirer.prompt([
    {
      type: 'input',
      name: 'endPoint',
      message: 'endPoint',
      validate (s) {
        return s.trim() ? true : `[${s}] is not allowed.`;
      }
    },
    {
      type: 'input',
      name: 'accessId',
      message: 'accessId',
      validate (s) {
        return s.trim() ? true : `[${s}] is not allowed.`;
      }
    },{
      type: 'input',
      name: 'secretKey',
      message: 'secretKey',
      validate (s) {
        return s.trim() ? true : `[${s}] is not allowed.`;
      }
    },{
      type: 'input',
      name: 'domain',
      message: 'domain',
      validate (s) {
        return s.trim() ? true : `[${s}] is not allowed.`;
      }
    },{
      type: 'input',
      name: 'bucket',
      message: 'bucket',
      validate (s) {
        return s.trim() ? true : `[${s}] is not allowed.`;
      }
    }
  ]).then(answers => {
    fs.writeFileSync(cdnFile, JSON.stringify(answers, null, 2), { encoding: 'utf8' });
    console.log();
    console.log(chalk.green('Your cdn config is save successfully.'));
  });
} else {
  if (!isExistConfig) {
    console.log('There is no config file, please create a config first:');
    console.log();
    console.log(chalk.cyan('  $ fle upload --init'));
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
    console.log(chalk.red('There are no files matched to upload!'));
    process.exit(1);
  }

  inquirer.prompt([
    {
      type: 'checkbox',
      name: 'files',
      message: 'Please check files that you want to upload',
      choices: choices,
      validate (a) {
        return a.length ? true : `please choose file.`;
      }
    }
  ]).then(answers => {
    var nosConfig = require(cdnFile);
    nosConfig.prefix = 'fle/a0df1d4009c7a2ec5fee/' + (+new Date()) + '/';
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
            console.log(chalk.green.bold(res.url));
          } else {
            console.log(chalk.red.bold(res.message || 'Upload failed!'));
          }
        });
        console.log('===========================================');
        console.log();
      }).catch(err => {
        console.log(err)
      });
    }

    if (imagemins.length) {
      nosUpload.uploadMultiImage(imagemins).then(values => {
        console.log();
        console.log('============= Image Min Info ==============');
        values.forEach(res => {
          if (res.success) {
            console.log(chalk.green.bold(res.url));
          } else {
            console.log(chalk.red.bold(res.message || 'Upload failed!'));
          }
        });
        console.log('===========================================');
        console.log();
      }).catch(err => {
        console.log(err)
      });
    }
  }).catch(err => {
    console.log(err);
  });
}