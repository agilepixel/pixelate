/*! Agile Pixel https://agilepixel.io - 2022 */
const { argv } = require('yargs');
const isProduction = !!((argv.env && argv.env.production) || argv.p);
module.exports = ({ file, options, environment }) => ({
    plugins: {
        'postcss-preset-env': isProduction ? {} : false,
        cssnano: isProduction ? {} : false,
    },
});
