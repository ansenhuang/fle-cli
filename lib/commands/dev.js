// var fs = require('fs');
var path = require('path');
var program = require('commander');
var spawn = require('cross-spawn');
var color = require('@fle/color');
var { fleHomePath } = require('../consts');
var { portProbe } = require('../utils');

program
	.usage('[options]')
	.option('-l, --log', '启用移动端调试工具')
	.on('--help', () => {
		console.log();
	})
	.parse(process.argv);

var opts = program.opts();
var fle = require(path.resolve('fle.json'));

function startWebpackServer (p) {
	portProbe(p, '0.0.0.0', function (isValid) {
		if (isValid) {
			var env = Object.assign({
				NODE_ENV: 'development',
				PROJECT_ROOT_PATH: process.cwd(),
				FLE_VCONSOLE: opts.log,
				FLE_PORT: p,
				FLE_COMPILE_PAGES: program.args.slice(1).join(',')
			}, process.env);

			// dev-server
			spawn(
				path.join(fleHomePath, 'node_modules/.bin/webpack-dev-server'),
				[
					'--progress',
					'--config',
					path.join(fleHomePath, 'build/webpack/webpack.dev.config.js')
				],
				{
					cwd: fleHomePath,
					stdio: 'inherit',
					env: env
				}
			);
		} else {
			console.log(color.cyan(`端口【${p}】已被占用，正在尝试新端口...`));
			startWebpackServer(p + 1);
		}
	});
}

// 先检查端口是否占用再开启webpack-dev-server
startWebpackServer(fle.port || 5000);
