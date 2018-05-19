var config = require('./config');

var eslintConfig = {
  "root": true,
  "parserOptions": {
    "parser": "babel-eslint",
    "sourceType": "module"
  },
  "env": {
    "browser": true,
    "es6": true
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
    "prefer-promise-reject-errors": 0,
    "no-unused-vars": config.dev ? 1 : 2,
    "no-debugger": config.dev ? 1 : 2,
    "no-console": [config.dev ? 1 : 2, {
      "allow": ["info", "warn", "error"]
    }]
  }
};

if (!config.vue) {
  eslintConfig.parser = "babel-eslint";
} else {
  eslintConfig.parserOptions.parser = "babel-eslint";
}

module.exports = eslintConfig;
