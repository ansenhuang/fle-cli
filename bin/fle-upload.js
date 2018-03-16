#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var program = require('commander');
var inquirer = require('inquirer');
var chalk = require('chalk');
var consts = require('../lib/consts');
// var utils = require('../lib/utils');
var NosUpload = require('../lib/nos-upload');

program
  .usage('<dir|file|glob>')
	.option('-i, --init', 'configure your accessId and secretKey only once before upload')
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

  program.args.forEach((file, index) => {
    var stat = fs.statSync(path.resolve(file));

    if (stat.isFile()) {
      choices.push({
        name: file,
        value: file,
        short: index + 1,
        checked: true
      });
    }
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
    var nosUpload = new NosUpload(nosConfig);
    var promises = [];

    answers.files.forEach(file => {
      promises.push(
        nosUpload.uploadFile({
          filepath: path.resolve(file),
          filename: file
        })
      );
    });

    Promise.all(promises).then((values) => {
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
      console.log(err);
    });
  });
}