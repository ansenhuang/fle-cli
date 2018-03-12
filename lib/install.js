var fs = require('fs');
var path = require('path');
var execSync = require('child_process').execSync;
var consts = require('./consts');
var utils = require('./utils');

if (!fs.existsSync(consts.homeFlePath)) {
  fs.mkdirSync(consts.homeFlePath);
}

fs.writeFileSync(
  path.join(consts.homeFlePath, 'package.json'),
  fs.readFileSync(path.join(__dirname, '../package.build.json')),
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

fs.writeFileSync(path.join(__dirname, '../.installed'), '', { encoding: 'utf8' });
