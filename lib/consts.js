var os = require('os');
var path = require('path');
var { name, version } = require('../package.json');

exports.pkgName = name;
exports.pkgVersion = version;
exports.fleHomePath = path.join(os.homedir(), '.fle');
exports.boilerplates = ['app', 'react', 'vue', 'lib'];
exports.needVerifyCommands = ['dev', 'build', 'lib'];
exports.wenmanPlatform = {
  'snail': {
    id: 'UA1493360523621',
    icon: 'https://yuedust.yuedu.126.net/snail_st/static/images/favicon.ico'
  },
  'comic-h5': {
    id: 'UA1494482568873',
    icon: 'https://h5.manhua.163.com/favicon.ico'
  },
  'yuedu-h5': {
    id: 'UA-48676860-1',
    icon: 'https://yuedust.yuedu.126.net/assets/mobile/images/favicon/favicon.ico'
  },
  'yuedu-web': {
    id: 'UA-25074971-1',
    icon: 'https://yuedust.yuedu.126.net/favicon.ico'
  },
  'lofter': {
    id: 'UA-31007899-1',
    icon: 'https://imglf0.nosdn.127.net/img/ajZLb1FCRTZ5dEpPdVhFMFlBa3V0MlRZQ1hwL0kxVWQ2Nnd4Z0sxQ0NJbHIwN2w5ZUd2OHVRPT0.png'
  }
};
