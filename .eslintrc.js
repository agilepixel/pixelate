/*! Agile Pixel https://agilepixel.io - 2021*/
module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'agilepixel',
    'prettier',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaFeatures: {
      globalReturn: true,
      generators: false,
      objectLiteralDuplicateProperties: false,
      experimentalObjectRestSpread: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    allowImportExportEverywhere: true,
    requireConfigFile: false,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  rules: {
    '@typescript-eslint/no-var-requires': 'warn',
    'import/no-commonjs': 'off',
  },
};