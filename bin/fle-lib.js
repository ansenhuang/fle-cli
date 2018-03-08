#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var program = require('commander');
var chalk = require('chalk');
var spawn = require('child_process').spawn;
var checkProject = require('../lib/utils').checkProject;

// 检查是否为fle项目
var typeOpts = checkProject();

program
	.usage('[options]')
	.on('--help', () => {
		console.log();
	})
	.parse(process.argv);

var rootPath = path.join(__dirname, '..');
// var opts = program.opts();
var env = Object.assign({
	NODE_ENV: 'production',
	PROJECT_ROOT_PATH: process.cwd(),
}, process.env);

if (typeOpts.tag === 'rollup') {
	// 清空先前编译的文件
	spawn(
		path.join(rootPath, 'node_modules/.bin/rimraf'),
		[
			path.resolve('lib')
		],
		{
			cwd: rootPath,
			stdio: 'inherit'
		}
	);

	// lib
	spawn(
		path.join(rootPath, 'node_modules/.bin/rollup'),
		[
			'-c',
			path.join(rootPath, 'lib/rollup/rollup.lib.config.js'),
		],
		{
			cwd: rootPath,
			stdio: 'inherit',
			env: env
		}
	);
} else if (typeOpts.tag === 'webpack') {
	// 清空先前编译的文件
	spawn(
		path.join(rootPath, 'node_modules/.bin/rimraf'),
		[
			path.resolve('lib')
		],
		{
			cwd: rootPath,
			stdio: 'inherit'
		}
	);

	// build
	spawn(
		path.join(rootPath, 'node_modules/.bin/webpack'),
		[
			'--progress',
			'--hide-modules',
			'--config',
			path.join(rootPath, 'lib/webpack/webpack.lib.config.js')
		],
		{
			cwd: rootPath,
			stdio: 'inherit',
			env: env
		}
	);
}
