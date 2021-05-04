/*! Agile Pixel https://agilepixel.io - 2021*/
module.exports = {
    root: true,
    globals: { wp: true },
    env: {
        node: true,
        es6: true,
        amd: true,
        browser: true,
        jquery: true,
    },
    parser: 'vue-eslint-parser',
    extends: ['agilepixel', 'prettier'],
    'parserOptions': {
        'parser': 'babel-eslint',
        'ecmaFeatures': {
          'globalReturn': true,
          'generators': false,
          'objectLiteralDuplicateProperties': false,
          'experimentalObjectRestSpread': true,
        },
        'ecmaVersion': 2017,
        'sourceType': 'module',
        'allowImportExportEverywhere': true,
    },
    plugins: ['import'],
    settings: {
        'import/core-modules': [],
        'import/ignore': [
            'node_modules',
            '\\.(coffee|scss|css|less|hbs|svg|json)$',
        ],
        polyfills: ['Promise', 'IntersectionObserver', 'fetch', 'Array.from'],
    },
    rules: {
        'max-len': 'off'
    },
};
  