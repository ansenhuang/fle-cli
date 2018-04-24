var config = require('./config');

var eslintConfig = {
  // "root": true,
  "parserOptions": {
    "parser": "babel-eslint",
    "sourceType": "module"
  },
  "env": {
    "browser": true
  },
  "globals":{
    "console": true
  },
  "extends": ["standard"],
  "plugins": [],
  "rules": {
    "eol-last": 0,
    "comma-dangle": 0,
    "operator-linebreak": 0,
    "no-var": 1,
    "no-alert": 1,
    "prefer-promise-reject-errors": 0,
    "no-unused-vars": config.dev ? 1 : 2,
    "no-debugger": config.dev ? 1 : 2,
    "no-console": [config.dev ? 1 : 2, {
      "allow": ["info", "warn", "error"]
    }]
  }
};

module.exports = eslintConfig;
