// var fs = require('fs');
var path = require('path');
var program = require('commander');
var spawn = require('cross-spawn');
var color = require('@fle/color');
var { fleHomePath } = require('../consts');
var { checkProject } = require('../utils');

// 检查是否为fle项目
var fle = checkProject();

program
	// .usage('')
	.on('--help', () => {
		console.log();
	})
	.parse(process.argv);

// var opts = program.opts();
var env = Object.assign({
	NODE_ENV: 'production',
	PROJECT_ROOT_PATH: process.cwd()
}, process.env);
var babelEnvConfig = {
	"modules": false,
	"loose": true,
	"useBuiltIns": false,
	"targets": {
		"browsers": fle.browsers || [
			"last 4 versions",
      "ie >= 9",
      "iOS >= 7",
      "Android >= 4"
		]
	}
};

function fleResolve (name) {
	return require.resolve(path.join(fleHomePath, 'node_modules', name));
}

// 清空先前编译的文件
spawn(
	path.join(__dirname, '../../node_modules/.bin/rimraf'),
	[
		path.resolve('lib')
	],
	{
		stdio: 'inherit'
	}
);

if (fle.compileType === 'babel') {
	spawn(
		path.join(fleHomePath, 'node_modules/.bin/babel'),
		[
			// '--no-babelrc',
			path.resolve('src/common'),
			'--out-dir',
			path.resolve('lib'),
			'--copy-files',
			'--no-comments',
			'--ignore=**/*.min.js',
			'--presets=' + JSON.stringify([[fleResolve('babel-preset-env'), babelEnvConfig], fle.react && fleResolve('babel-preset-react'), fleResolve('babel-preset-stage-2')].filter(p => p)),
			'--plugins=' + JSON.stringify([fleResolve('babel-plugin-transform-decorators-legacy'), fleResolve('babel-plugin-transform-runtime')])
		],
		{
			cwd: fleHomePath,
			stdio: 'inherit'
		}
	);
} else {
	spawn(
		path.join(fleHomePath, 'node_modules/.bin/webpack-cli'),
		[
			'--progress',
			'--hide-modules',
			'--config',
			path.join(fleHomePath, 'build/webpack/webpack.lib.config.js')
		],
		{
			cwd: fleHomePath,
			stdio: 'inherit',
			env: env
		}
	);
}
