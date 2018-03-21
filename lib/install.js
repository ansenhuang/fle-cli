var fs = require('fs');
var path = require('path');
var execSync = require('child_process').execSync;
var consts = require('./consts');
var utils = require('./utils');
var buildPkg = require('../package.build.json');

if (!fs.existsSync(consts.homeFlePath)) {
  fs.mkdirSync(consts.homeFlePath);
}

fs.writeFileSync(
  path.join(consts.homeFlePath, 'package.json'),
  JSON.stringify(buildPkg, null, 2),
  { encoding: 'utf8' }
);

console.log('Build installing...');
console.log('===========================================');

execSync(utils.useYarn() ? 'yarn install' : 'npm install', {
  cwd: consts.homeFlePath,
  stdio: 'inherit'
});

console.log('===========================================');
console.log();

var homeBuildPath = path.join(consts.homeFlePath, 'build');
execSync(path.join(__dirname, '../node_modules/.bin/rimraf') + ' ' + homeBuildPath);
utils.copy(path.join(__dirname, '../build'), homeBuildPath);

// 安装完成后，再写入fle版本号，用于检查是否更新
buildPkg['fle-version'] = consts.pkg.version;

fs.writeFileSync(
  path.join(consts.homeFlePath, 'package.json'),
  JSON.stringify(buildPkg, null, 2),
  { encoding: 'utf8' }
);
