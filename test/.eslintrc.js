module.exports = {
    'root': true,
    'extends': 'agilepixel',
    'globals': {
      'wp': true,
    },
    'env': {
      'node': true,
      'es6': true,
      'amd': true,
      'browser': true,
      'jquery': true,
    },
    "parser": "babel-eslint",
    "parserOptions": {    
      "ecmaFeatures": {
        "globalReturn": true,
        "generators": false,
        "objectLiteralDuplicateProperties": false
      },
      "ecmaVersion": 2017,
      "sourceType": "module",
      "allowImportExportEverywhere": true
    },
    'plugins': [
      'import',
    ],
    'settings': {
      'import/core-modules': [],
      'import/ignore': [
        'node_modules',
        '\\.(coffee|scss|css|less|hbs|svg|json)$',
      ],
      "polyfills": [
        "Promise",
        "IntersectionObserver",
        "fetch",
        "Array.from"
      ]
    },
    'rules': {
      'max-len': 'off',
      'no-debugger': 'off',
      'valid-jsdoc': 'warn',
      'comma-spacing': 'error',
      'array-bracket-spacing': ["error", "never"]
    },
  };
  