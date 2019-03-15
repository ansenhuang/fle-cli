var fs = require('fs');
var path = require('path');
var program = require('commander');
var inquirer = require('inquirer');
var spawn = require('cross-spawn');
var { fleHomePath } = require('../consts');

program
	.usage('[options] <pages>')
	.option('-u, --upload', '编译并上传编译后的文件')
	.option('-r, --report', '查看构建依赖分析报告')
	.option('-t, --target', '定向编译页面')
	.on('--help', () => {
		console.log();
	})
	.parse(process.argv);

var opts = program.opts();
// var rimrafPath = path.join(__dirname, '../../node_modules/.bin/rimraf');

function startWebpackBuild (pages) {
	var env = Object.assign({
		NODE_ENV: 'production',
		PROJECT_ROOT_PATH: process.cwd(),
		FLE_UPLOAD: opts.upload,
		FLE_REPORT: opts.report,
		FLE_COMPILE_PAGES: (pages && pages.length) ? pages.join(',') : ''
	}, process.env);

	// 清空先前编译的文件
	// spawn(
	// 	rimrafPath,
	// 	[
	// 		path.resolve('dist')
	// 	],
	// 	{
	// 		stdio: 'inherit'
	// 	}
	// );

	// build
	spawn(
		path.join(fleHomePath, 'node_modules/.bin/webpack-cli'),
		[
			'--progress',
			'--hide-modules',
			'--config',
			path.join(fleHomePath, 'build/webpack/webpack.build.config.js')
		],
		{
			cwd: fleHomePath,
			stdio: 'inherit',
			env: env
		}
	);
}

if (!opts.target) {
	startWebpackBuild();
} else {
	var pages = require('../../build/webpack/utils').getPages(path.resolve('src'));

	inquirer.prompt([
    {
      type: 'checkbox',
      name: 'pages',
      message: '请选择需要编译的页面',
      choices: pages.map(page => {
				var name = page.title || page.id;

				if (name !== page.id) {
					name += '(' + page.id + ')';
				}

				return {
					name: name,
					value: page.id,
					checked: false
				};
			}),
      validate (a) {
        return a.length ? true : `请选择页面`;
      }
    }
  ]).then(answers => {
		startWebpackBuild(answers.pages);
	});
}
