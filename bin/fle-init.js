#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var program = require('commander');
var inquirer = require('inquirer');
var chalk = require('chalk');
var execSync = require('child_process').execSync;
var consts = require('../lib/consts');
var utils = require('../lib/utils');

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
    choices: Object.keys(consts.boilerplates).map(k => {
      var o = consts.boilerplates[k];
      return {
        name: '          '.replace(new RegExp(` {${k.length}}`), k) + `->  [${o.compiler}] ${o.message}`,
        value: k
      }
    }),
    default: 'app'
  },
  {
    type: 'confirm',
    name: 'extract',
    message: 'Do you want to extract css from library?',
    default: false,
    when (answers) {
      return answers.boilerplate === 'lib'
    }
  },
  {
    type: 'confirm',
    name: 'iife',
    message: 'Do you want to format library with IIFE?',
    default: false,
    when (answers) {
      return answers.boilerplate === 'lib'
    }
  },
  {
    type: 'confirm',
    name: 'rem',
    message: 'Do you want to use rem layout for h5?',
    default: false,
    when (answers) {
      return answers.boilerplate !== 'lib'
    }
  }
]).then(answers => {
  var bpConsts = consts.boilerplates[answers.boilerplate];
  var cdn = require('../lib/json/cdn.json');
  var originPath = path.join(__dirname, '../boilerplate', answers.boilerplate);
  var targetPath = path.resolve(projectName);
  var tplPkg = require(path.join(originPath, 'package.json'));
  var tplFle = require(path.join(__dirname, '../lib/json', `fle-${bpConsts.compiler}.json`));

  tplPkg.name = answers.name;
  tplPkg.author = utils.getGitUser();

  tplFle.boilerplate = answers.boilerplate;

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

  fs.mkdirSync(targetPath);
  fs.writeFileSync(path.join(targetPath, 'package.json'), JSON.stringify(tplPkg, null, 2), { encoding: 'utf8' });
  fs.writeFileSync(path.join(targetPath, 'fle.json'), JSON.stringify(tplFle, null, 2), { encoding: 'utf8' });

  utils.copy(originPath, targetPath);

  // install modules
  if (tplPkg.dependencies && Object.keys(tplPkg.dependencies).length) {
    console.log();
    console.log('===========================================');

    execSync(utils.useYarn() ? 'yarn install' : 'npm install', {
      cwd: targetPath,
      stdio: 'inherit'
    });

    console.log('===========================================');
  }

  console.log();
  console.log('To start project:');
  console.log();
  console.log(chalk.cyan(`  $ cd ${projectName}`));
  console.log(chalk.cyan('  $ fle dev'));
  console.log();
});
