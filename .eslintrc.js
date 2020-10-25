/*! 🧮🧩 2020*/
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
        "ecmaVersion": 2017,
        "sourceType": "module",
        "allowImportExportEverywhere": true
    },
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: { ecmaVersion: 2018 },
};