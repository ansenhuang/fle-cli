var fs = require('fs');
var path = require('path');
var { fleHomePath } = require('../consts');

var babelFile = path.join(fleHomePath, 'node_modules/@babel/cli/lib/babel/options.js');

var file = fs.readFileSync(babelFile, 'utf-8');
file = file.replace('const values = value.split(",");', `
  let values;

  if (!/^\\[.+\\]$/.test(value)) {
    values = value.split(",");
  } else {
    try {
      values = JSON.parse(value);
    } catch (error) {
      values = value.split(",");
    }
  }
`);

fs.writeFileSync(babelFile, file);
