var fs = require('fs');
var path = require('path');
var { fleHomePath } = require('../consts');

var babelFile = path.join(fleHomePath, 'node_modules/babel-cli/lib/babel/index.js');

var file = fs.readFileSync(babelFile, 'utf-8');
file = file.replace('opts[key] = commander[key];', `
if (key === 'presets' || key === 'plugins') {
  try {
    opts[key] = JSON.parse(commander[key]);
  } catch (error) {
    opts[key] = commander[key];
  }
} else {
  opts[key] = commander[key];
}
`);

fs.writeFileSync(babelFile, file);
