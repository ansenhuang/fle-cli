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
	utils.spawn(
		rimrafPath,
		[
			path.resolve('lib')
		],
		{
			stdio: 'inherit'
		}
	);

	// lib
	if (typeOpts.fle.iife) {
		utils.spawn(
			path.join(homeFlePath, 'node_modules/.bin/rollup'),
			[
				'-c',
				path.join(homeFlePath, 'build/rollup/rollup.lib.config.js'),
			],
			{
				cwd: homeFlePath,
				stdio: 'inherit',
				env: env
			}
		);
	} else {
		var babelEnvConfig = {
			"modules": false,
			"loose": true,
			"useBuiltIns": false,
			"targets": {
				"browsers": [
					"last 2 versions",
					"ie >= 9",
					"ios >= 7",
					"android >= 4"
				]
			}
		};

		function fleResolve (name) {
			return require.resolve(path.join(homeFlePath, 'node_modules', name));
		}

		utils.spawn(
			path.join(homeFlePath, 'node_modules/.bin/babel'),
			[
				// '--no-babelrc',
				path.resolve('src'),
				'--out-dir',
				path.resolve('lib'),
				'--copy-files',
				'--no-comments',
				'--ignore=**/*.min.js',
				// '--presets=' + [fleResolve('babel-preset-react'), fleResolve('babel-preset-stage-2')].join(','),
				// '--plugins=' + [fleResolve('babel-plugin-transform-vue-jsx'), fleResolve('babel-plugin-transform-decorators-legacy'), fleResolve('babel-plugin-transform-runtime')].join(',')
				'--presets=' + JSON.stringify([[fleResolve('babel-preset-env'), babelEnvConfig], fleResolve('babel-preset-react'), fleResolve('babel-preset-stage-2')]),
				'--plugins=' + JSON.stringify([fleResolve('babel-plugin-transform-vue-jsx'), fleResolve('babel-plugin-transform-decorators-legacy'), fleResolve('babel-plugin-transform-runtime')])
			],
			{
				cwd: homeFlePath,
				stdio: 'inherit',
				env: env
			}
		);
	}
} else if (typeOpts.compiler === 'webpack') {
	// 清空先前编译的文件
	utils.spawn(
		rimrafPath,
		[
			path.resolve('lib')
		],
		{
			stdio: 'inherit'
		}
	);

	// build
	utils.spawn(
		path.join(homeFlePath, 'node_modules/.bin/webpack'),
		[
			'--progress',
			'--hide-modules',
			'--config',
			path.join(homeFlePath, 'build/webpack/webpack.lib.config.js')
		],
		{
			cwd: homeFlePath,
			stdio: 'inherit',
			env: env
		}
	);
}
