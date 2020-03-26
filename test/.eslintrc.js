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
      'import/dynamic-import-chunkname': 'off',
      "template-curly-spacing" : "off",
      "indent" : "off"
    },
    
  };
  