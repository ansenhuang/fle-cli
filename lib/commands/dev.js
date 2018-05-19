// var fs = require('fs');
var path = require('path');
var program = require('commander');
var spawn = require('cross-spawn');
var color = require('@fle/color');
var { fleHomePath } = require('../consts');
var { checkProject } = require('../utils');

// 检查是否为fle项目
var fle = checkProject();

program
	.usage('[options]')
	.option('-l, --log', '启用移动端调试工具')
	.on('--help', () => {
		console.log();
	})
	.parse(process.argv);

var opts = program.opts();
var env = Object.assign({
	NODE_ENV: 'development',
	PROJECT_ROOT_PATH: process.cwd(),
	FLE_VCONSOLE: opts.log,
	FLE_COMPILE_PAGES: program.args.slice(1).join(',')
}, process.env);

// dev-server
spawn(
	path.join(fleHomePath, 'node_modules/.bin/webpack-dev-server'),
	[
		'--progress',
		'--config',
		path.join(fleHomePath, 'build/webpack/webpack.dev.config.js')
	],
	{
		cwd: fleHomePath,
		stdio: 'inherit',
		env: env
	}
);
