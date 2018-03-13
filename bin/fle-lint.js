#!/usr/bin/env node

'use strict';

// var fs = require('fs');
var path = require('path');
var program = require('commander');
// var chalk = require('chalk');
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

if (typeOpts.compiler === 'rollup') {
	spawn(
		path.join(homeFlePath, 'node_modules/.bin/eslint'),
		[
			'-c',
			path.join(homeFlePath, 'build/rollup/eslint.js'),
			path.resolve('src'),
			// path.resolve('public/demo')
		],
		{
			cwd: homeFlePath,
			stdio: 'inherit',
			env: env
		}
	);
} else if (typeOpts.compiler === 'webpack') {
	spawn(
		path.join(homeFlePath, 'node_modules/.bin/eslint'),
		[
			'-c',
			path.join(homeFlePath, 'build/webpack/eslint.js'),
			path.resolve('src')
		],
		{
			cwd: homeFlePath,
			stdio: 'inherit',
			env: env
		}
	);
}
