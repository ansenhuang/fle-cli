var path = require('path');
var projectRootPath = process.env.PROJECT_ROOT_PATH;

function resolve (p) {
  return path.join(projectRootPath, p);
}

exports.resolve = resolve;