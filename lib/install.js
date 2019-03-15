var fs = require('fs');
var path = require('path');
var spawn = require('cross-spawn');
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

var result = spawn.sync(useYarn() ? 'yarn' : 'npm', ['install'], {
  cwd: fleHomePath,
  stdio: 'inherit'
});

console.log('===========================================');
if (result.status !== 0) {
  console.log('安装失败，请根据错误信息重新安装。');
  process.exit(2);
}
console.log();

var buildHomePath = path.join(fleHomePath, 'build');
spawn.sync(path.join(__dirname, '../node_modules/.bin/rimraf'), [buildHomePath]);
copyDir(path.join(__dirname, '../build'), buildHomePath);

// 安装完成后，再写入fle版本号，用于检查是否更新
buildPkg['fle-version'] = pkgVersion;

fs.writeFileSync(
  path.join(fleHomePath, 'package.json'),
  JSON.stringify(buildPkg, null, 2),
  { encoding: 'utf8' }
);
