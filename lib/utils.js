var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var execSync = require('child_process').execSync;
var consts = require('./consts');

function copy (origin, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
  }

  fs.readdirSync(origin).forEach(file => {
    let originFile = path.join(origin, file);
    let targetFile = path.join(target, file.replace(/\.keep$/, ''));
    let stat = fs.statSync(originFile);

    if (stat.isDirectory()) {
      copy(originFile, targetFile);
    } else if (!fs.existsSync(targetFile)) {
      fs.writeFileSync(targetFile, fs.readFileSync(originFile), { encoding: 'utf8' });
    }
  });
}

function getGitUser () {
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

function checkProject () {
  var fleFile = path.resolve('fle.json');

  if (!fs.existsSync(fleFile)) {
    console.log();
    console.log('The current directory is not a project and without fle.json!');
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

exports.copy = copy;
exports.getGitUser = getGitUser;
exports.checkProject = checkProject;
