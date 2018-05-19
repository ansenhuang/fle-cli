var spawn = require('cross-spawn');
var args = process.argv.slice(2);

var level = 'patch';

if (args.indexOf('minor') !== -1) {
  level = 'minor';
} else if (args.indexOf('major') !== -1) {
  level = 'major';
}

spawn.sync('npm', ['version', level], { stdio: 'inherit' });
spawn.sync('npm', ['publish'], { stdio: 'inherit' });
spawn.sync('git', ['push'], { stdio: 'inherit' });
