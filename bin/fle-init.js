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
  .usage('<project-name> [options]')
	.option('-y, --yes', 'init a project by default')
	.option('-p, --page', 'create a page in current project')
  .on('--help', () => {
    console.log();
  })
  .parse(process.argv);

var projectName = program.args[0];
var opts = program.opts();

if (!projectName) {
  program.help();
}

if (!opts.page) {
  if (fs.existsSync(projectName)) {
    console.log();
    console.log(`The directory of ${chalk.red(projectName)} is already exist!`);
    console.log();

    process.exit(1);
  }

  inquirer.prompt([
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
    }
  ]).then(res => {
    var fleRollup = require('../lib/json/fle-rollup.json');
    var fleWebpack = require('../lib/json/fle-webpack.json');

    var answers = res.boilerplate !== 'lib' ? fleWebpack : fleRollup;
    answers.boilerplate = res.boilerplate;
    answers.name = projectName;
    answers.description = 'A project created by fle-cli.';
    answers.keywords = 'fle-cli,webpack,rollup';

    if (opts.yes) {
      initProject(answers);
    } else {
      var prompts = [
        // package
        {
          type: 'input',
          name: 'name',
          message: 'Project name',
          default: answers.name
        },
        {
          type: 'input',
          name: 'description',
          message: 'Project description',
          default: answers.description
        },
        {
          type: 'input',
          name: 'keywords',
          message: 'Project keywords',
          default: answers.keywords
        },
        {
          type: 'confirm',
          name: 'eslint',
          message: 'Do you want to use eslint to format code?',
          default: true
        }
      ];

      if (answers.boilerplate === 'lib') {
        prompts.push(
          {
            type: 'confirm',
            name: 'extract',
            message: 'Do you want to extract css from library?',
            default: false
          },
          {
            type: 'confirm',
            name: 'iife',
            message: 'Do you want to format iife library?',
            default: false
          }
        );
      } else {
        answers.business = projectName;

        prompts.push(
          {
            type: 'confirm',
            name: 'splitCommon',
            message: 'Do you want to split common js from all pages?',
            default: false
          }
        );
      }

      inquirer.prompt(prompts).then(res2 => {
        initProject(Object.assign(answers, res2));
      });
    }
  });

  function initProject (answers) {
    var bpConsts = consts.boilerplates[answers.boilerplate];
    var originPath = path.join(__dirname, '../boilerplate', answers.boilerplate);
    var targetPath = path.resolve(projectName);
    var tplPkg = require(path.join(originPath, 'package.json'));

    tplPkg.name = answers.name;
    tplPkg.description = answers.description;
    tplPkg.keywords = answers.keywords.split(',');
    tplPkg.author = utils.getGitUser();

    delete answers.name;
    delete answers.description;
    delete answers.keywords;

    fs.mkdirSync(targetPath);
    fs.writeFileSync(path.join(targetPath, 'package.json'), JSON.stringify(tplPkg, null, 2), { encoding: 'utf8' });
    fs.writeFileSync(path.join(targetPath, 'fle.json'), JSON.stringify(answers, null, 2), { encoding: 'utf8' });

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

    if (answers.boilerplate !== 'lib') {
      console.log('And create page:');
      console.log();
      console.log(chalk.cyan(`  $ fle init <page-name> --page`));
      console.log();
    }
  }
} else {
  utils.checkProject();

  let targetPath = path.resolve('src/' + projectName);

  if (fs.existsSync(targetPath)) {
    console.log();
    console.log(`The directory of ${chalk.red('src/' + projectName)} is already exist!`);
    console.log();

    process.exit(1);
  }

  if (opts.yes) {
    initPage({
      title: projectName,
      description: '',
      keywords: '',
      icon: '',
      template: '/default.html',
      uaId: ''
    });
  } else {
    inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Document title',
        default: projectName
      },
      {
        type: 'input',
        name: 'description',
        message: 'Document description',
        default: ''
      },
      {
        type: 'input',
        name: 'keyswords',
        message: 'Document keywords',
        default: ''
      },
      {
        type: 'input',
        name: 'icon',
        message: 'Document icon (url)',
        default: ''
      },
      {
        type: 'list',
        name: 'template',
        message: 'Choose html template',
        choices: [
          { name: 'default (no pv)', value: '/default.html' },
          { name: 'h5 (rem, pv)', value: '/h5.html' },
          { name: 'pc (pv)', value: '/pc.html' },
          { name: 'custom (define by yourself)', value: 'custom' }
        ],
        default: '/default.html'
      },
      {
        type: 'list',
        name: 'uaId',
        message: 'Choose ID for UA',
        choices: [
          { name: '云阅读', value: 'UA-25074971-1' },
          { name: '漫画', value: 'UA1494482568873' },
          { name: '蜗牛', value: 'UA1493360523621' },
          { name: 'Lofter', value: 'UA-31007899-1' }
        ],
        default: '',
        when (a) {
          return ['/h5.html', '/pc.html'].indexOf(a.template) !== -1;
        }
      },
      {
        type: 'input',
        name: 'remUnit',
        message: 'Root html font-size for rem',
        default: 50,
        when (a) {
          return a.template === '/h5.html'
        }
      },
    ]).then(res => {
      initPage(res);
    });
  }

  function initPage (answers) {
    let cdn = require('../lib/json/cdn.json');

    fs.mkdirSync(targetPath);

    answers.compiled = true;
    answers.css = [cdn.css.reset];

    if (answers.template === '/h5.html') {
      answers.prejs = [cdn.js.remResize];
    } else if (answers.template === 'custom') {
      answers.template = path.join('src', projectName, 'index.html');

      fs.writeFileSync(
        path.join(targetPath, 'index.html'),
        fs.readFileSync(path.join(__dirname, '../build/.share/template/default.html')),
        { encoding: 'utf8' }
      );
    }

    fs.writeFileSync(path.join(targetPath, 'app.json'), JSON.stringify(answers, null, 2), { encoding: 'utf8' });
    fs.writeFileSync(path.join(targetPath, 'index.js'), '', { encoding: 'utf8' });

    console.log();
    console.log(chalk.green('init page successfully!'));
    console.log();
  }
}
