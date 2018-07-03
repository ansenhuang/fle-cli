var fs = require('fs');
var path = require('path');
var program = require('commander');
var inquirer = require('inquirer');
var color = require('@fle/color');
var { execSync } = require('child_process');
var { getGitUser, useYarn, copyDir, checkProject } = require('../utils');
var { wenmanPlatform } = require('../consts');

program
  .usage('<project|page> [options]')
	.option('-p, --page', '在当前工程中创建新页面')
  .on('--help', () => {
    console.log();
  })
  .parse(process.argv);

var projectName = program.args[0];
var opts = program.opts();

if (!projectName) {
  program.help();
}

// 创建工程
if (!opts.page) {
  if (fs.existsSync(projectName)) {
    console.log(`\n该工程已存在：${color.cyan(projectName)}\n`);
    process.exit(1);
  }

  inquirer.prompt([
    {
      type: 'list',
      name: 'boilerplate',
      message: '选择样板工程',
      choices: [
        { name: 'react  ->  React多页面工程', value: 'react' },
        { name: 'vue    ->  Vue多页面工程', value: 'vue' },
        { name: 'app    ->  原生JS多页面工程', value: 'app' },
        { name: 'lib    ->  JS库工程', value: 'lib' },
        { name: 'node   ->  node工程', value: 'node' }
      ],
      default: 'react'
    },
    // library添加额外信息
    {
      type: 'input',
      name: 'name',
      message: 'package name',
      default: projectName,
      when (a) {
        return a.boilerplate === 'lib' || a.boilerplate === 'node'
      }
    },
    {
      type: 'input',
      name: 'description',
      message: 'package description',
      default: 'A library created by fle-cli.',
      when (a) {
        return a.boilerplate === 'lib' || a.boilerplate === 'node'
      }
    },
    {
      type: 'input',
      name: 'keywords',
      message: 'package keywords',
      default: 'fle-cli,webpack',
      when (a) {
        return a.boilerplate === 'lib' || a.boilerplate === 'node'
      }
    },
    {
      type: 'list',
      name: 'compileType',
      message: '选择编译类型',
      choices: [
        { name: 'babel           ->  生成ES6文件', value: 'babel' },
        { name: 'iife            ->  生成自执行JS文件', value: 'iife' },
        { name: 'umd             ->  生成umd文件', value: 'umd' },
        { name: 'commonjs        ->  生成commonjs文件', value: 'commonjs' }
      ],
      default: 'babel',
      when (a) {
        return a.boilerplate === 'lib'
      }
    },
    {
      type: 'input',
      name: 'engine',
      message: '兼容node的最低版本',
      default: process.versions.node,
      when (a) {
        return a.boilerplate === 'node'
      }
    },
    // 页面工程
    {
      type: 'confirm',
      name: 'example',
      message: '是否需要载入示例页面？',
      default: true,
      when (a) {
        return a.boilerplate !== 'node'
      }
    }
  ]).then(res => {
    var originPath = path.join(__dirname, '../../boilerplate', res.boilerplate);
    var targetPath = path.resolve(projectName);
    var pkgTpl = require(path.join(originPath, 'package.json'));

    if (res.boilerplate !== 'node') {
      var fleWebpack = require('../json/fle-webpack.json');

      pkgTpl.author = getGitUser();
      if (res.boilerplate === 'lib') {
        pkgTpl.name = res.name;
        pkgTpl.description = res.description;
        pkgTpl.keywords = res.keywords.split(',');

        fleWebpack.compileType = res.compileType;
        fleWebpack.react = false;
        fleWebpack.vue = false;
      }

      fleWebpack.business = projectName;
      fleWebpack.boilerplate = res.boilerplate;

      fs.mkdirSync(targetPath);
      fs.writeFileSync(path.join(targetPath, 'package.json'), JSON.stringify(pkgTpl, null, 2), { encoding: 'utf8' });
      fs.writeFileSync(path.join(targetPath, 'fle.json'), JSON.stringify(fleWebpack, null, 2), { encoding: 'utf8' });

      copyDir(originPath, targetPath, !res.example && /^example$/);

      // install modules
      if (pkgTpl.dependencies && Object.keys(pkgTpl.dependencies).length) {
        console.log();
        console.log('===========================================');
        execSync(useYarn() ? 'yarn install' : 'npm install', {
          cwd: targetPath,
          stdio: 'inherit'
        });
        console.log('===========================================');
      }

      console.log();
      console.log('启动工程：');
      console.log();
      console.log('  $ ' + color.cyan(`cd ${projectName}`));
      console.log('  $ ' + color.cyan('fle dev'));
      console.log();

      if (res.boilerplate !== 'lib') {
        console.log('创建页面：');
        console.log();
        console.log('  $ ' + color.cyan('fle init <page> --page'));
        console.log();
      }
    } else {
      pkgTpl.name = res.name;
      pkgTpl.description = res.description;
      pkgTpl.keywords = res.keywords.split(',');
      pkgTpl.author = getGitUser();

      if (res.engine) {
        pkgTpl.engines = { node: '>=' + res.engine };
      }

      fs.mkdirSync(targetPath);
      fs.writeFileSync(path.join(targetPath, 'package.json'), JSON.stringify(pkgTpl, null, 2), { encoding: 'utf8' });

      copyDir(originPath, targetPath);

      console.log();
      console.log('启动工程：');
      console.log();
      console.log('  $ ' + color.cyan(`cd ${projectName}`));
      console.log('  $ ' + color.cyan('fle lib -w'));
      console.log();
    }
  });
} else {
  var fle = checkProject();
  var targetPath = path.resolve('src/' + projectName);

  if (fle.boilerplate === 'lib') {
    console.log(`\n该目录为JS库工程，无需创建页面\n`);
    process.exit(1);
  }

  if (fs.existsSync(targetPath)) {
    console.log(`\n该页面文件夹已存在：${color.cyan('src/' + projectName)}\n`);
    process.exit(1);
  }

  inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: '页面标题',
      default: projectName
    },
    {
      type: 'list',
      name: 'template',
      message: '选择页面模板',
      choices: [
        { name: 'default       -> 默认模板', value: '/default.html' },
        { name: 'h5            -> 包含rem自适应布局', value: '/h5/default.html' },
        { name: 'pc            -> 包含css重置', value: '/pc/default.html' },
        { name: 'user-defined  -> 自定义模板，会在目录生成html文件', value: 'custom' },
        { name: 'h5-wenman     -> 文漫特有模版，包含rem方案和pv统计', value: '/h5/wenman.html' },
        { name: 'pc-wenman     -> 文漫特有模版，包含css重置和pv统计', value: '/pc/wenman.html' },
        { name: 'ftl-wenman    -> 文漫特有模版，h5版FreeMarker（Java）', value: 'ftl-wenman' }
      ],
      default: '/default.html'
    },
    {
      type: 'list',
      name: 'platform',
      message: '选择文漫产品',
      choices: Object.keys(wenmanPlatform),
      default: '',
      when (a) {
        return a.template.indexOf('wenman') !== -1;
      }
    },
    {
      type: 'confirm',
      name: 'example',
      message: '是否需要载入示例代码？',
      default: true
    }
  ]).then(res => {
    var cdn = require('../json/cdn.json');
    var examplePath = path.join(__dirname, '../../boilerplate', fle.boilerplate, 'src/example');
    var app = {
      title: res.title,
      description: '',
      keywords: '',
      template: res.template,
      filename: '',
      icon: '',
      prejs: [],
      css: [],
      js: [],
      compiled: true
    };

    // 创建目录
    if (projectName.indexOf('/') === -1) {
      fs.mkdirSync(targetPath);
    } else {
      var currentPath = path.resolve('src');
      projectName.split('/').forEach(dir => {
        currentPath = path.join(currentPath, dir);
        if (!fs.existsSync(currentPath)) {
          fs.mkdirSync(currentPath);
        }
      });
    }

    // 添加相应的外链文件
    if (res.template.indexOf('/h5/') !== -1) {
      app.css = [cdn.css.reset];
      app.prejs = [cdn.js.remResize];
    } else if (res.template.indexOf('/pc/') !== -1) {
      app.css = [cdn.css.reset];
    } else if (res.template === 'ftl-wenman') {
      app.css = [cdn.css.reset];
      app.prejs = [cdn.js.remResize];
      app.template = path.join('src', projectName, 'index.ftl');
      app.filename = `ftl/${projectName}.ftl`

      fs.writeFileSync(
        path.join(targetPath, 'index.ftl'),
        fs.readFileSync(path.join(__dirname, '../../build/.share/template/h5/wenman.ftl')),
        { encoding: 'utf8' }
      );
    } else if (res.template === 'custom') {
      app.template = path.join('src', projectName, 'index.html');
      app.filename = `html/${projectName}.html`

      fs.writeFileSync(
        path.join(targetPath, 'index.html'),
        fs.readFileSync(path.join(__dirname, '../../build/.share/template/default.html')),
        { encoding: 'utf8' }
      );
    }

    // 添加文漫统计ID和页面图标
    if (res.platform) {
      var platformItem = wenmanPlatform[res.platform];
      app.uaId = platformItem.id;
      app.icon = platformItem.icon;
    } else {
      app.icon = '/favicon.ico';
    }

    fs.writeFileSync(path.join(targetPath, 'app.json'), JSON.stringify(app, null, 2), { encoding: 'utf8' });

    if (res.example) {
      copyDir(examplePath, targetPath);
    } else {
      fs.writeFileSync(path.join(targetPath, 'index.js'), '', { encoding: 'utf8' });
    }

    console.log(color.green('\n页面创建成功!\n'));
  });
}
