var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var consts = require('./consts');
var childProcess = require('child_process');
var execSync = childProcess.execSync;

exports.spawn = process.platform !== 'win32' ?
  childProcess.spawn
  :
  require('cross-spawn');

exports.copy = function (origin, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
  }

  fs.readdirSync(origin).forEach(file => {
    let originFile = path.join(origin, file);
    let targetFile = path.join(target, file.replace(/\.keep$/, ''));
    let stat = fs.statSync(originFile);

    if (stat.isDirectory()) {
      exports.copy(originFile, targetFile);
    } else if (!fs.existsSync(targetFile)) {
      fs.writeFileSync(targetFile, fs.readFileSync(originFile), { encoding: 'utf8' });
    }
  });
}

exports.getGitUser = function () {
  var name;
  var email;

  try {
    name = execSync('git config --get user.name');
    email = execSync('git config --get user.email');
  } catch (e) {}

  name = (name && name.toString().trim()) || '';
  email = (email && ` <${email.toString().trim()}>`) || '';

  return name + email;
}

exports.checkProject = function () {
  var fleFile = path.resolve('fle.json');

  if (!fs.existsSync(fleFile)) {
    console.log();
    console.log('The current directory isn\'t exist fle.json!');
    console.log();

    process.exit(1);
  }

  var fle = require(fleFile);

  if (!fle || !fle.boilerplate || !consts.boilerplates[fle.boilerplate]) {
    console.log();
    console.log(`The boilerplate of fle.json is not supported!`);
    console.log();

    process.exit(1);
  }

  return consts.boilerplates[fle.boilerplate];
}

exports.useYarn = function () {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}
