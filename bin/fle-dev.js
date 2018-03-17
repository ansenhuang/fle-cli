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
	.usage('[options] <pages>')
	.option('-l, --log', 'show vconsole for debug on mobile')
	.on('--help', () => {
		console.log();
    console.log('  Description:');
    console.log();
		console.log('    It will compile all pages from src by default');
		console.log('    And you can specify pages that should be compiled');
		console.log('    For example: $ fle build index home');
		console.log('    So [src/index] and [src/home] will be compiled');
		console.log('    Have fun with it!');
		console.log();
	})
	.parse(process.argv);

var opts = program.opts();
var env = Object.assign({
	NODE_ENV: 'development',
	PROJECT_ROOT_PATH: process.cwd(),
	FLE_FRAMEWORK: typeOpts.framework,
	FLE_VCONSOLE: opts.log,
	FLE_COMPILE_PAGES: program.args.join(',')
}, process.env);

if (typeOpts.compiler === 'rollup') {
	utils.spawn(
		path.join(homeFlePath, 'node_modules/.bin/rollup'),
		[
			'-c',
			path.join(homeFlePath, 'build/rollup/rollup.config.js'),
			'-w',
		],
		{
			cwd: homeFlePath,
			stdio: 'inherit',
			env: env
		}
	);
} else if (typeOpts.compiler === 'webpack') {
	// server
	utils.spawn(
		path.join(homeFlePath, 'node_modules/.bin/webpack-dev-server'),
		[
			'--inline',
			'--progress',
			'--config',
			path.join(homeFlePath, 'build/webpack/webpack.dev.config.js')
		],
		{
			cwd: homeFlePath,
			stdio: 'inherit',
			env: env
		}
	);
}
