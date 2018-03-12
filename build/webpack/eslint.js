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
  "extends": [
    "standard",
    config.react && "plugin:react/recommended",
    config.vue && "plugin:vue/essential"
  ].filter(p => p),
  "plugins": [],
  "rules": {
    "no-var": 1,
    "no-alert": 1,
    "no-unused-vars": config.dev ? 1 : 2,
    "no-debugger": config.dev ? 1 : 2,
    "no-console": [config.dev ? 1 : 2, {
      "allow": ["info", "warn", "error"]
    }]
  }
};

module.exports = eslintConfig;