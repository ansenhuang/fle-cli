var fs = require('fs');
var path = require('path');
var projectRootPath = process.env.PROJECT_ROOT_PATH;

function resolve (p) {
  return path.join(projectRootPath, p);
}

function getPages (dir, prefix = '', pages = []) {
  fs.readdirSync(dir).forEach((dirname) => {
    // common目录除外
    if (dirname === 'common') return;

    var id = prefix + dirname;
    var childDirPath = path.join(dir, dirname);
    var childDirStat = fs.statSync(childDirPath);

    if (childDirStat.isDirectory()) {
      var appPath = path.join(childDirPath, 'app.json');

      if (fs.existsSync(appPath)) {
        var appConfig = require(appPath);
        var entryPath = path.join(childDirPath, appConfig.entry || 'index.js');
        var modulePath = path.join(childDirPath, appConfig.module || 'module.js');

        if (appConfig.compiled && fs.existsSync(entryPath)) {
          pages.push(Object.assign({}, appConfig, {
            id: id,
            entry: entryPath,
            module: fs.existsSync(modulePath) ? modulePath : false
          }));
        }
      } else {
        getPages(childDirPath, id + '/', pages);
      }
    }
  });

  return pages;
}

exports.getPages = getPages;
exports.resolve = resolve;