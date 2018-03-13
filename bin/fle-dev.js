#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var program = require('commander');
// var chalk = require('chalk');
var { spawn, spawnSync } = require('child_process');
var homeFlePath = require('../lib/consts').homeFlePath;
var checkProject = require('../lib/utils').checkProject;

// 检查是否为fle项目
var typeOpts = checkProject();

program
	.usage('[options]')
	.option('-d, --dll', 'rebuild dll manifest before open server (just for webpack)')
	.option('-l, --log', 'show vconsole for debug on mobile')
	.on('--help', () => {
		console.log();
	})
	.parse(process.argv);

var opts = program.opts();
var env = Object.assign({
	NODE_ENV: 'development',
	PROJECT_ROOT_PATH: process.cwd(),
	FLE_FRAMEWORK: typeOpts.framework,
	FLE_VCONSOLE: opts.log
}, process.env);

if (typeOpts.compiler === 'rollup') {
	spawn(
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
	var tarPkg = require(path.resolve('package.json'));
	var hasDll = fs.existsSync(path.resolve('.cache/dll/dll-manifest.json'));
	var hasDeps = Object.keys(tarPkg.dependencies || {}).length !== 0;

	if (hasDeps && (opts.dll || !hasDll)) {
		console.log('Build dll vendor...');
    console.log('===========================================');

		spawnSync(
			path.join(homeFlePath, 'node_modules/.bin/webpack'),
			[
				'--progress',
				'--hide-modules',
				'--config',
				path.join(homeFlePath, 'build/webpack/webpack.dll.config.js')
			],
			{
				cwd: homeFlePath,
				stdio: 'inherit',
				env: env
			}
		);

    console.log('===========================================');
		console.log();
	}

	// server
	spawn(
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
			env: Object.assign({
				FLE_DLL_REFERENCE: hasDeps
			}, env)
		}
	);
}
