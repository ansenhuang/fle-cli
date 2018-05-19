var fs = require('fs');
var path = require('path');
var { execSync } = require('child_process');
var { boilerplates } = require('./consts');

exports.copyDir = function (origin, target, exclude) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
  }

  fs.readdirSync(origin).forEach(file => {
    if (exclude && exclude.test(file)) return;

    var originFile = path.join(origin, file);
    var targetFile = path.join(target, file.replace(/\.keep$/, ''));
    var originStat = fs.statSync(originFile);

    if (originStat.isDirectory()) {
      exports.copyDir(originFile, targetFile, exclude);
    } else if (!fs.existsSync(targetFile)) {
      fs.writeFileSync(targetFile, fs.readFileSync(originFile), { encoding: 'utf8' });
    }
  });
}

exports.getGitUser = function () {
  var name, email;

  try {
    name = execSync('git config --get user.name');
    email = execSync('git config --get user.email');
  } catch (err) {}

  name = (name && name.toString().trim()) || '';
  email = (email && ` <${email.toString().trim()}>`) || '';

  return name + email;
}

exports.useYarn = function () {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (err) {
    return false;
  }
}

// 校验是否为fle项目
exports.checkProject = function () {
  var fleFile = path.resolve('fle.json');

  if (!fs.existsSync(fleFile)) {
    console.log(`\n当前目录不是fle项目\n`);
    process.exit(1);
  }

  var fle = require(fleFile);

  if (boilerplates.indexOf(fle.boilerplate) === -1) {
    console.log(`\n暂不支持该项目模版：${fle.boilerplate}\n`);
    process.exit(1);
  }

  return fle;
}
