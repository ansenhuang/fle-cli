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
      'prerelease'
    ],
    default: 'patch'
  }
]).then(answers => {
  spawn.sync('npm', ['version', answers.version], { stdio: 'inherit' });
  spawn.sync('npm', ['run', 'log'], { stdio: 'inherit' });
  spawn.sync('git', ['add', 'CHANGELOG.md'], { stdio: 'inherit' });
  spawn.sync('git', ['commit', '-m', 'changelog'], { stdio: 'inherit' });
  spawn.sync('git', ['push'], { stdio: 'inherit' });
  spawn.sync('npm', ['publish'], { stdio: 'inherit' });
});
