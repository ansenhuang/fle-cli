var os = require('os');
var path = require('path');
var pkg = require('../package.json');

exports.pkg = pkg;

exports.homeFle = path.join(os.homedir(), '.fle.json');

exports.boilerplate = {
  lib: {
    tag: 'rollup',
    message: 'build javascript library'
  },
  app: {
    tag: 'webpack',
    message: 'build pages by javascript'
  },
  react: {
    tag: 'webpack',
    message: 'build pages by react'
  },
  vue: {
    tag: 'webpack',
    message: 'build pages by vue'
  },
  module: {
    tag: 'webpack',
    message: 'build component of react or vue'
  }
};
