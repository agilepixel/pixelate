const { argv } = require('yargs');
const isProduction = !!((argv.env && argv.env.production) || argv.p);
module.exports = ({ file, options, environment }) => ({
    plugins: {
        autoprefixer: {'grid':'no-autoplace'},
        cssnano: isProduction ? {} : false,
    },
});
