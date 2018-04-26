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
var babelEnvConfig = {
	"modules": false,
	"loose": true,
	"useBuiltIns": false,
	"targets": {
		"browsers": typeOpts.fle.browsers || [
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

function babelBuild ({ source, dest, isVue, isReact }) {
	utils.spawn(
		path.join(homeFlePath, 'node_modules/.bin/babel'),
		[
			// '--no-babelrc',
			path.resolve(source),
			'--out-dir',
			path.resolve(dest),
			'--copy-files',
			'--no-comments',
			'--ignore=**/*.min.js',
			'--presets=' + JSON.stringify([[fleResolve('babel-preset-env'), babelEnvConfig], isReact && fleResolve('babel-preset-react'), fleResolve('babel-preset-stage-2')].filter(p => p)),
			'--plugins=' + JSON.stringify([isVue && fleResolve('babel-plugin-transform-vue-jsx'), fleResolve('babel-plugin-transform-decorators-legacy'), fleResolve('babel-plugin-transform-runtime')].filter(p => p))
		],
		{
			cwd: homeFlePath,
			stdio: 'inherit',
			env: env
		}
	);
}

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

if (typeOpts.compiler === 'rollup') {
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
		babelBuild({ source: 'src', dest: 'lib' });
	}
} else if (typeOpts.compiler === 'webpack') {
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
