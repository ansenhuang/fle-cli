#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var program = require('commander');
var inquirer = require('inquirer');
var chalk = require('chalk');
var execSync = require('child_process').execSync;
var utils = require('../lib/utils');
var constants = require('../lib/constants');

program
  .usage('<project-name>')
  .on('--help', () => {
    console.log();
  })
  .parse(process.argv);

var projectName = program.args[0];

if (!projectName) {
  program.help();
}

if (fs.existsSync(projectName)) {
  console.log();
  console.log(`The directory of ${chalk.red(projectName)} is already exist!`);
  console.log();

  process.exit(1);
}

inquirer.prompt([
  {
    type: 'input',
    name: 'name',
    message: 'Project name',
    default: projectName
  },
  {
    type: 'list',
    name: 'boilerplate',
    message: 'Choose boilerplate',
    choices: Object.keys(constants.boilerplate).map(k => {
      var o = constants.boilerplate[k];
      return {
        name: `${k}: ${o.message} [${o.tag}]`,
        value: k
      }
    }),
    default: 'lib'
  },
  {
    type: 'confirm',
    name: 'extract',
    message: 'Do you need to extract css in module',
    default: false,
    when (answers) {
      return answers.boilerplate === 'lib'
    }
  },
  {
    type: 'confirm',
    name: 'iife',
    message: 'Do you want to export iife module',
    default: false,
    when (answers) {
      return answers.boilerplate === 'lib'
    }
  },
  {
    type: 'confirm',
    name: 'rem',
    message: 'Do you want to use rem layout',
    default: false,
    when (answers) {
      return answers.boilerplate !== 'lib'
    }
  },
  {
    type: 'list',
    name: 'install',
    message: 'Which tools would you like to install',
    choices: ['yarn', 'npm', 'none'],
    default: 'yarn',
    when (answers) {
      var pkg = require(path.join(__dirname, '../boilerplate', answers.boilerplate, 'package.json'));
      return pkg.dependencies && Object.keys(pkg.dependencies).length
    }
  }
]).then(answers => {
  var cdn = require('../lib/cdn.json');
  var originPath = path.join(__dirname, '../boilerplate', answers.boilerplate);
  var targetPath = path.resolve(projectName);

  fs.mkdirSync(targetPath);

  var tplPkg = require(path.join(originPath, 'package.json'));
  var tplFle = require(path.join(originPath, 'fle.json'));

  tplPkg.name = answers.name;
  tplPkg.author = utils.getGitUser();

  if (typeof answers.extract !== 'undefined') {
    tplFle.extract = answers.extract;
  }

  if (typeof answers.iife !== 'undefined') {
    tplFle.iife = answers.iife;
  }

  if (typeof answers.rem !== 'undefined') {
    tplFle.css.push(cdn.css.reset);

    if (answers.rem) {
      tplFle.prejs.push(cdn.js.fsize);
    }
  }

  fs.writeFileSync(path.join(targetPath, 'package.json'), JSON.stringify(tplPkg, null, 2), { encoding: 'utf8' });
  fs.writeFileSync(path.join(targetPath, 'fle.json'), JSON.stringify(tplFle, null, 2), { encoding: 'utf8' });

  utils.copy(originPath, targetPath);

  // install modules
  if (answers.install && answers.install !== 'none') {
    console.log();

    execSync(answers.install + ' install', {
			cwd: targetPath,
      stdio: 'inherit'
    });

    console.log();
    console.log(chalk.green('Install successfully!'));
  }

  console.log();
  console.log('To start project you can:');
  console.log();
  console.log(chalk.cyan(`  $ cd ${projectName}`));
  if (answers.install === 'none') {
    console.log(chalk.cyan('  $ npm install'));
  }
  console.log(chalk.cyan('  $ fle dev'));
  console.log();
});
