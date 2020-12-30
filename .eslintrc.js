/*! Agile Pixel https://agilepixel.io - 2020*/
module.exports = {
    env: {
        commonjs: true,
        es6: true,
        node: true,
    },
    root: true,
    parser: "vue-eslint-parser",
    extends: ['agilepixel', 'prettier', "prettier/vue",
    "prettier/unicorn"],
    "parserOptions": {
        "parser": "babel-eslint",
        "ecmaFeatures": {
          "globalReturn": true,
          "generators": false,
          "objectLiteralDuplicateProperties": false,
          "experimentalObjectRestSpread": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module",
        "allowImportExportEverywhere": true
    },
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    rules: {
        'import/no-commonjs': 'off',
    },
};