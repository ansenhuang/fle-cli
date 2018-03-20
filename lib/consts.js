var os = require('os');
var path = require('path');
var pkg = require('../package.json');

exports.pkg = pkg;

// 编译依赖包位置
exports.homeFlePath = path.join(os.homedir(), '.fle');

exports.boilerplates = {
  app: {
    compiler: 'webpack',
    framework: '',
    message: 'build pages by javascript'
  },
  react: {
    compiler: 'webpack',
    framework: 'react',
    message: 'build pages by react'
  },
  vue: {
    compiler: 'webpack',
    framework: 'vue',
    message: 'build pages by vue'
  },
  lib: {
    compiler: 'rollup',
    framework: '',
    message: 'build javascript library'
  },
  module: {
    compiler: 'webpack',
    framework: 'react|vue',
    message: 'build component of react or vue'
  }
};