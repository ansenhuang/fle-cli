var fs = require('fs');
var path = require('path');
var net = require('net');
var crypto = require('crypto');
var { execSync } = require('child_process');
var color = require('@fle/color');
var { boilerplates, pkgVersion } = require('./consts');

function copyDir (origin, target, exclude) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
  }

  fs.readdirSync(origin).forEach(file => {
    if (exclude && exclude.test(file)) return;

    var originFile = path.join(origin, file);
    var targetFile = path.join(target, file.replace(/\.keep$/, ''));
    var originStat = fs.statSync(originFile);

    if (originStat.isDirectory()) {
      copyDir(originFile, targetFile, exclude);
    } else if (!fs.existsSync(targetFile)) {
      fs.writeFileSync(targetFile, fs.readFileSync(originFile), { encoding: 'utf8' });
    }
  });
}

function getGitUser () {
  var name, email;

  try {
    name = execSync('git config --get user.name');
    email = execSync('git config --get user.email');
  } catch (err) {}

  name = (name && name.toString().trim()) || '';
  email = (email && ` <${email.toString().trim()}>`) || '';

  return name + email;
}

function useYarn () {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (err) {
    return false;
  }
}

// v1 - v2
function compareVersion (v1, v2) {
  if (v1 === v2) {
    return 0;
  }

  var a1 = v1.split('.');
  var a2 = v2.split('.');

  if (a1[0] !== a2[0]) {
    return a1[0] - a2[0];
  }

  if (a1[1] !== a2[1]) {
    return a1[1] - a2[1];
  }

  if (a1[2] !== a2[2]) {
    return a1[2] - a2[2];
  }

  return 0;
}

// 校验是否为fle项目
function checkProject () {
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

  if (compareVersion(fle.version || '0.0.0', pkgVersion) < 0) {
    console.log();
    console.log(color.warn('请更新项目依赖的fle版本！'));
    console.log('  项目依赖的版本：' + color.cyan(fle.version));
    console.log('  当前安装的版本：' + color.cyan(pkgVersion));
    console.log(color.cyan('  方法：更改fle.json的version字段为当前安装的版本'));
    console.log();
  }

  return fle;
}

// 检测port是否被占用
function portProbe (port, hostname, callback) {
  // 创建服务并监听该端口
  var server = net.createServer();

  server.listen(port, hostname, function () {
    server.once('close', function () {
      callback(true, port, hostname);
    });
    server.close();
  });

  server.once('error', function (err) {
    if (err.code === 'EADDRINUSE') { // 端口已经被使用
      callback(false, port, hostname);
    }
  });
}

function createHash (str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

exports.copyDir = copyDir;
exports.getGitUser = getGitUser;
exports.useYarn = useYarn;
exports.compareVersion = compareVersion;
exports.checkProject = checkProject;
exports.portProbe = portProbe;
exports.createHash = createHash;
