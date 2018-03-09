#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var program = require('commander');
var chalk = require('chalk');
var inquirer = require('inquirer');
var spawn = require('child_process').spawn;
var constants = require('../lib/constants');
var utils = require('../lib/utils');

program
  .version(constants.pkg.version)
  .usage('<command> [options]')
  .on('--help', () => {
    console.log();
    console.log('  Commands:');
    console.log();
    console.log('    init           generate the project');
    console.log('    dev            open server in development');
    console.log('    lib            build library or module in production');
    console.log('    build          build pages or demo in production');
    console.log('    update         check the lastest and update');
    console.log();
  })
  .parse(process.argv);

var subcmd = program.args[0];
var args = process.argv.slice(3);

var aliases = {
  "i": "init",
  "d": "dev",
  "l": "lib",
  "b": "build",
  "u": "update"
}

if (aliases[subcmd]) {
  subcmd = aliases[subcmd];
}

// 每天检查更新
// if (subcmd !== 'update') {
//   var date = utils.formatDate();

//   if (!fs.existsSync(constants.homeFle) || require(constants.homeFle).date !== date) {
//     if (utils.checkUpdate()) {
//       inquirer.prompt([
//         {
//           type: 'confirm',
//           name: 'update',
//           message: 'A new version was found, do you want to update',
//           default: true
//         }
//       ]).then(answers => {
//         if (answers.update) {
//           utils.update(true);
//         }
//       });
//     }
//   }
// }

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
  })
}
