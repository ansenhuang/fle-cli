#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var program = require('commander');
var chalk = require('chalk');
var spawn = require('child_process').spawn;
var homeFlePath = require('../lib/consts').homeFlePath;
var checkProject = require('../lib/utils').checkProject;

// 检查是否为fle项目
var typeOpts = checkProject();

program
	.usage('[options]')
	.on('--help', () => {
		console.log();
	})
	.parse(process.argv);

// var opts = program.opts();
var env = Object.assign({
	NODE_ENV: 'production',
	PROJECT_ROOT_PATH: process.cwd(),
	FLE_FRAMEWORK: typeOpts.framework
}, process.env);
var rimrafPath = path.join(__dirname, '../node_modules/.bin/rimraf');

if (typeOpts.compiler === 'rollup') {
	// 清空先前编译的文件
	spawn(
		rimrafPath,
		[
			path.resolve('public/dist')
		],
		{
			stdio: 'inherit'
		}
	);

	// demo
	spawn(
		path.join(homeFlePath, 'node_modules/.bin/rollup'),
		[
			'-c',
			path.join(homeFlePath, 'build/rollup/rollup.config.js'),
		],
		{
			cwd: homeFlePath,
			stdio: 'inherit',
			env: env
		}
	);
} else if (typeOpts.compiler === 'webpack') {
	// 清空先前编译的文件
	spawn(
		rimrafPath,
		[
			path.resolve('dist')
		],
		{
			stdio: 'inherit'
		}
	);

	// build
	spawn(
		path.join(homeFlePath, 'node_modules/.bin/webpack'),
		[
			'--progress',
			'--hide-modules',
			'--config',
			path.join(homeFlePath, 'build/webpack/webpack.build.config.js')
		],
		{
			cwd: homeFlePath,
			stdio: 'inherit',
			env: env
		}
	);
}
