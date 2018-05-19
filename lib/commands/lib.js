var fs = require('fs');
var path = require('path');
var program = require('commander');
var spawn = require('cross-spawn');
var color = require('@fle/color');
var { fleHomePath } = require('../consts');

program
	.usage('[options]')
	.option('-w, --watch', '监听文件改动并重新编译（for node）')
	.on('--help', () => {
		console.log();
	})
	.parse(process.argv);

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

function fleResolve (name) {
	return require.resolve(path.join(fleHomePath, 'node_modules', name));
}

var opts = program.opts();
var fle = fs.existsSync(path.resolve('fle.json')) ? require(path.resolve('fle.json')) : null;

if (fle) {
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
} else {
	var pkg = fs.existsSync(path.resolve('package.json')) ? require(path.resolve('package.json')) : {};

	var babelEnvConfig = {
		"modules": "commonjs",
		"loose": true,
		"useBuiltIns": true,
		"targets": {
			"node": (pkg.engine && pkg.engine.node.substr(2)) || "current"
		}
	};

	spawn(
		path.join(fleHomePath, 'node_modules/.bin/babel'),
		[
			// '--no-babelrc',
			opts.watch && '--watch',
			path.resolve('src'),
			'--out-dir',
			path.resolve('lib'),
			'--copy-files',
			'--no-comments',
			'--ignore=**/*.min.js',
			'--presets=' + JSON.stringify([[fleResolve('babel-preset-env'), babelEnvConfig]]),
			// '--plugins=' + JSON.stringify([fleResolve('babel-plugin-transform-runtime')])
		].filter(a => a),
		{
			cwd: fleHomePath,
			stdio: 'inherit'
		}
	);
}
