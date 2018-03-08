var fs = require('fs');
var path = require('path');

var rollupFile = path.join(__dirname, '../node_modules/rollup/bin/rollup');

var file = fs.readFileSync(rollupFile, 'utf-8');
file = file.replace("SHOW_ALTERNATE_SCREEN = '\\u001B[?1049h'", "SHOW_ALTERNATE_SCREEN = ''");
file = file.replace("HIDE_ALTERNATE_SCREEN = '\\u001B[?1049l'", "HIDE_ALTERNATE_SCREEN = ''");

fs.writeFileSync(rollupFile, file);
