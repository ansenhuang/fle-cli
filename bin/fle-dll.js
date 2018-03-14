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
	.option('-d, --dev', 'build vendors for development (just for webpack)')
	.option('-b, --build', 'build vendors for production (just for webpack)')
	.option('-u, --upload', 'upload files to cdn (just for webpack in production)')
	.on('--help', () => {
		console.log();
	})
	.parse(process.argv);

var opts = program.opts();
var env = Object.assign({
	NODE_ENV: opts.build ? 'production' : 'development',
	PROJECT_ROOT_PATH: process.cwd(),
	FLE_FRAMEWORK: typeOpts.framework,
	FLE_UPLOAD: opts.upload
}, process.env);

if (typeOpts.compiler === 'webpack') {
	// dll
	spawn(
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
}
