/*! Agile Pixel https://agilepixel.io - 2021*/
const path = require('path');

const { argv } = require('yargs');
const { merge } = require('webpack-merge');
const cosmiconfig = require('cosmiconfig');

const explorer = cosmiconfig.cosmiconfigSync('pixelate');

const userConfig = explorer.search();

const isProduction = argv.mode === 'production';
const rootPath =
userConfig != undefined && userConfig.paths && userConfig.paths.root
    ? userConfig.paths.root
    : process.cwd();

const distPath = userConfig != undefined && userConfig.config && userConfig.config.distPath
    ? userConfig.config.distPath
    : 'public/dist';

const relativeRootPath = userConfig != undefined && userConfig.config && userConfig.config.relativeRoot
    ? userConfig.config.relativeRoot
    : '';
    
const config = merge(
  {
    open: true,
    copy: [],
    devServerPort: 8080,
    proxyUrl: 'http://localhost:8080',
    cacheBusting: '[name]_[contenthash]',
    paths: {
      root: rootPath,
      modernizr: path.join(rootPath, '.modernizrrc'),
      assets: path.join(rootPath, ''),
      dist: path.join(rootPath, distPath),
      relative: path.join(rootPath, relativeRootPath),
    },
    enabled: {
      sourceMaps: !isProduction,
      optimize: isProduction,
      cacheBusting: isProduction,
      watcher: !!argv.watch,
    },
    resolveAlias: {
      modernizr: path.join(rootPath, '.modernizrrc'),
      vue$: 'vue/dist/vue.esm.js',
      masonry: 'masonry-layout',
      isotope: 'isotope-layout',
    },
    watch: [],
    manifestPath: 'assets.json',
  },
  userConfig.config
);

module.exports = merge(config, {
    env: Object.assign({
        production: isProduction, development: !isProduction, 
    },
    argv.env),
    publicPath: `${config.publicPath}/${path.basename(config.paths.dist)}/`,
    manifest: {},
});

if (process.env.NODE_ENV === undefined) {
    process.env.NODE_ENV = isProduction ? 'production' : 'development';
}