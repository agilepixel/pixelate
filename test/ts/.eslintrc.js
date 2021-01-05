/*! Agile Pixel https://agilepixel.io - 2020*/
module.exports = {
    parser: '@typescript-eslint/parser', // we are changing default parser
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        project: './tsconfig.json',
    },
    plugins: ['@typescript-eslint'],
    extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
    ],
    rules: {
        'header/header': 'off',
        '@typescript-eslint/no-empty-interface': 'warn',
        '@typescript-eslint/ban-types': 'warn',
        '@typescript-eslint/ban-ts-comment': 'warn',
        '@typescript-eslint/no-empty-function': 'warn'
    },
    overrides: [],
};
