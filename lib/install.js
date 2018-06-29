var fs = require('fs');
var path = require('path');
var { execSync } = require('child_process');
var { fleHomePath, pkgVersion } = require('./consts');
var { useYarn, copyDir } = require('./utils');
var buildPkg = require('../package.build.json');

if (!fs.existsSync(fleHomePath)) {
  fs.mkdirSync(fleHomePath);
}

fs.writeFileSync(
  path.join(fleHomePath, 'package.json'),
  JSON.stringify(buildPkg, null, 2),
  { encoding: 'utf8' }
);

console.log('安装构建配置...');
console.log('===========================================');

execSync(useYarn() ? 'yarn install' : 'npm install', {
  cwd: fleHomePath,
  stdio: 'inherit'
});

console.log('===========================================');
console.log();

var buildHomePath = path.join(fleHomePath, 'build');
execSync(path.join(__dirname, '../node_modules/.bin/rimraf') + ' ' + buildHomePath);
copyDir(path.join(__dirname, '../build'), buildHomePath);

// 安装完成后，再写入fle版本号，用于检查是否更新
buildPkg['fle-version'] = pkgVersion;

fs.writeFileSync(
  path.join(fleHomePath, 'package.json'),
  JSON.stringify(buildPkg, null, 2),
  { encoding: 'utf8' }
);
