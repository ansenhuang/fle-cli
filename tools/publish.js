var spawn = require('cross-spawn');
var inquirer = require('inquirer');

inquirer.prompt([
  {
    type: 'list',
    name: 'version',
    message: '选择发布版本',
    choices: [
      'patch',
      'minor',
      'major',
      'pre-release'
    ],
    default: 'patch'
  }
]).then(answers => {
  spawn.sync('npm', ['version', answers.version], { stdio: 'inherit' });
  spawn.sync('npm', ['run', 'log'], { stdio: 'inherit' });
  spawn.sync('npm', ['publish'], { stdio: 'inherit' });
  spawn.sync('git', ['push'], { stdio: 'inherit' });
});
