var fs = require('fs');
var path = require('path');
var program = require('commander');
var spawn = require('cross-spawn');
var color = require('@fle/color');
var { fleHomePath } = require('../consts');

program
	.usage('[options] <pages>')
	.option('-u, --upload', '编译并上传编译后的文件')
	.option('-r, --report', '查看构建依赖分析报告')
	.on('--help', () => {
		console.log();
	})
	.parse(process.argv);

var opts = program.opts();
var cdnFile = path.join(fleHomePath, '.cdn.json');
var env = Object.assign({
	NODE_ENV: 'production',
	PROJECT_ROOT_PATH: process.cwd(),
	FLE_UPLOAD: opts.upload,
	FLE_REPORT: opts.report,
	FLE_UPLOAD_CONFIG: (opts.upload && fs.existsSync(cdnFile)) ? JSON.stringify(require(cdnFile)) : '',
	FLE_COMPILE_PAGES: program.args.join(',')
}, process.env);
var rimrafPath = path.join(__dirname, '../../node_modules/.bin/rimraf');

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
