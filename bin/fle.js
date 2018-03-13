#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var program = require('commander');
var chalk = require('chalk');
var updateNotifier = require('update-notifier');
var spawn = require('child_process').spawn;
var consts = require('../lib/consts');
var utils = require('../lib/utils');

// 检查更新
updateNotifier({
  pkg: consts.pkg,
  updateCheckInterval: 86400000 // 每天检查一次
}).notify();

// 第一次启动需要安装编译需要的依赖
if (!fs.existsSync(path.join(__dirname, '../.installed'))) {
  require('../lib/install');
  require('../lib/rollup-watch-fix');
}

program
  .version(consts.pkg.version, '-v, --version')
  .usage('<command> [options]')
  .on('--help', () => {
    console.log();
    console.log('  Commands:');
    console.log();
    console.log('    init           generate a project');
    console.log('    dev            open server in development');
    console.log('    build          build pages or demo in production');
    console.log('    lib            build library or component in production');
    console.log();
  })
  .parse(process.argv);

var subcmd = program.args[0];
var args = process.argv.slice(3);

var aliases = {
  "i": "init",
  "d": "dev",
  "b": "build",
  "l": "lib"
}

if (aliases[subcmd]) {
  subcmd = aliases[subcmd];
}

if (!subcmd || subcmd === 'help') {
  program.help();
} else {
  var file = path.join(__dirname, `fle-${subcmd}.js`);

  fs.stat(file, (err) => {
    if (err) {
      console.log();
      console.log(`The command of ${chalk.red(subcmd)} is not supported!`);
      console.log();

      process.exit(1);
    }

    spawn(file, args, { stdio: 'inherit' });
  });
}
