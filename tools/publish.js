var spawn = require('cross-spawn');
var version = process.argv[2] || 'patch';

spawn.sync('npm', ['version', version], { stdio: 'inherit' });
spawn.sync('npm', ['publish'], { stdio: 'inherit' });
spawn.sync('git', ['push'], { stdio: 'inherit' });
