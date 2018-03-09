var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var execSync = require('child_process').execSync;
var constants = require('./constants');

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
  let name;
  let email;

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
    console.log(`The ${chalk.red('fle.json')} is not exist at current directory!`);
    console.log();

    process.exit(1);
  }

  var bp = require(fleFile).boilerplate;
  if (!constants.boilerplate[bp]) {
    console.log();
    console.log(`The boilerplate of ${chalk.red(bp)} is not supported!`);
    console.log();

    process.exit(1);
  }

  return constants.boilerplate[bp];
}

function checkUpdate () {
  var str = execSync('npm view ' + constants.pkg.name).toString();
  var matched = str.match(/\'dist-tags\': \{ latest: \'([\d\.]+)\' \}/);

  if (matched && matched[1]) {
    return matched[1] > constants.pkg.version;
  }

  return false;
}

function update (a) {
  var should = typeof a !== 'undefined' ? a : checkUpdate();

  if (should) {
    console.log();
    console.log(chalk.green('--------- Update starting... -----------'));
    console.log();
    execSync('npm update -g ' + constants.pkg.name, { stdio: 'inherit' });
    console.log();
    console.log(chalk.green('--------- Update successfully! ---------'));
    console.log();
  } else if (typeof a === 'undefined') {
    console.log();
    console.log(chalk.cyan('It\'s already the lastest version.'));
    console.log();
  }

  fs.writeFileSync(constants.homeFle, JSON.stringify({ date: formatDate() }, null, 2));
}

function formatDate () {
  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  var day = d.getDate();

  return [year, month > 9 ? month : '0' + month, day > 9 ? day : '0' + day].join('-');
}

exports.copy = copy;
exports.getGitUser = getGitUser;
exports.checkProject = checkProject;
exports.checkUpdate = checkUpdate;
exports.update = update;
exports.formatDate = formatDate;
