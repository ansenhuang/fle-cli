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
    "no-var": 1,
    "no-alert": 1,
    "no-unused-vars": config.dev ? 1 : 2,
    "no-debugger": config.dev ? 1 : 2,
    "no-console": [config.dev ? 1 : 2, {
      "allow": ["info", "warn", "error"]
    }]
  }
};

if (config.fle.boilerplate === 'react') {
  eslintConfig.extends.push("plugin:react/recommended");
} else if (config.fle.boilerplate === 'vue') {
  eslintConfig.extends.push("plugin:vue/essential");
}

module.exports = eslintConfig;
