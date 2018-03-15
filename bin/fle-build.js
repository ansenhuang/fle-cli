#!/usr/bin/env node

'use strict';

// var fs = require('fs');
var path = require('path');
var program = require('commander');
// var chalk = require('chalk');
var homeFlePath = require('../lib/consts').homeFlePath;
var utils = require('../lib/utils');

// 检查是否为fle项目
var typeOpts = utils.checkProject();

program
	.usage('[options]')
	.option('-u, --upload', 'upload files to cdn (just for webpack)')
	.on('--help', () => {
		console.log();
	})
	.parse(process.argv);

var opts = program.opts();
var env = Object.assign({
	NODE_ENV: 'production',
	PROJECT_ROOT_PATH: process.cwd(),
	FLE_FRAMEWORK: typeOpts.framework,
	FLE_UPLOAD: opts.upload
}, process.env);
var rimrafPath = path.join(__dirname, '../node_modules/.bin/rimraf');

if (typeOpts.compiler === 'rollup') {
	// 清空先前编译的文件
	utils.spawn(
		rimrafPath,
		[
			path.resolve('public/dist')
		],
		{
			stdio: 'inherit'
		}
	);

	// demo
	utils.spawn(
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
	// utils.spawn(
	// 	rimrafPath,
	// 	[
	// 		path.resolve('dist')
	// 	],
	// 	{
	// 		stdio: 'inherit'
	// 	}
	// );

	// build
	utils.spawn(
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
