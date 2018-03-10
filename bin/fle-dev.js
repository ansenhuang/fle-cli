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
	.option('-l, --log', 'show vconsole for debug on mobile')
	.on('--help', () => {
		console.log();
	})
	.parse(process.argv);

var rootPath = path.join(__dirname, '..');
var opts = program.opts();
var env = Object.assign({
	NODE_ENV: 'development',
	PROJECT_ROOT_PATH: process.cwd(),
	FLE_FRAMEWORK: typeOpts.framework,
	FLE_VCONSOLE: opts.log
}, process.env);

if (typeOpts.compiler === 'rollup') {
	// fix rollup watch
	require('../lib/rollup-watch-fix');

	spawn(
		path.join(rootPath, 'node_modules/.bin/rollup'),
		[
			'-c',
			path.join(rootPath, 'compiler/rollup/rollup.config.js'),
			'-w',
		],
		{
			cwd: rootPath,
			stdio: 'inherit',
			env: env
		}
	);
} else if (typeOpts.compiler === 'webpack') {
	spawn(
		path.join(rootPath, 'node_modules/.bin/webpack-dev-server'),
		[
			'--inline',
			'--progress',
			'--config',
			path.join(rootPath, 'compiler/webpack/webpack.config.js')
		],
		{
			cwd: rootPath,
			stdio: 'inherit',
			env: env
		}
	);
}
