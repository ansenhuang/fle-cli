var fs = require('fs');
var path = require('path');
var program = require('commander');
var spawn = require('cross-spawn');
// var color = require('@fle/color');
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
	var presets = [
    [
      fleResolve("@babel/preset-env"),
      {
        "modules": false,
        "loose": true,
        "useBuiltIns": 'usage',
        "targets": {
          "browsers": fle.browsers || [
						"last 4 versions",
						"ie >= 9",
						"iOS >= 7",
						"Android >= 4"
					]
        }
      }
    ],
    fle.react && fleResolve("@babel/preset-react")
  ].filter(p => p);
	var plugins = [
    [fleResolve("@babel/plugin-proposal-decorators"), { "legacy": true }],
    fleResolve("@babel/plugin-proposal-export-namespace-from"),
    fleResolve("@babel/plugin-syntax-dynamic-import"),
    [fleResolve("@babel/plugin-proposal-class-properties"), { "loose": true }],
    fleResolve("@babel/plugin-proposal-json-strings"),
    fleResolve("@babel/plugin-transform-runtime"),

    fle.vue && fleResolve("babel-plugin-transform-vue-jsx")
  ].filter(p => p);

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
				'--presets=' + JSON.stringify(presets),
				'--plugins=' + JSON.stringify(plugins)
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
			'--presets=' + JSON.stringify([[fleResolve('@babel/preset-env'), {
				"modules": "commonjs",
				"loose": true,
				"useBuiltIns": 'usage',
				"targets": {
					"node": (pkg.engine && pkg.engine.node.substr(2)) || "current"
				}
			}]]),
			'--plugins=' + JSON.stringify([fleResolve("@babel/plugin-proposal-export-namespace-from")])
		].filter(a => a),
		{
			cwd: fleHomePath,
			stdio: 'inherit'
		}
	);
}
