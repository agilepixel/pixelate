/*! Agile Pixel https://agilepixel.io - 2022*/
const path = require('path');
const fs = require('fs');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const autoprefixer = require('autoprefixer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
//const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const open = require('open');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const config = require('./config');

const assetsFilenames = config.enabled.cacheBusting
  ? config.cacheBusting
  : '[name]';

const profiler = process.argv.indexOf('--profile') !== -1;

const isDevelopmentServer = process.argv.indexOf('serve') !== -1;
const publicPath = isDevelopmentServer
  ? `https://localhost:${config.devServerPort}/`
  : config.publicPath;

if (isDevelopmentServer) {
  open(config.devUrl);
}

const entryKeys = Object.keys(config.entry);

const validStylelintDirectories = [];
for (const entryKey of entryKeys) {
  for (const directory of config.entry[entryKey]) {
    const newPath = `${path.dirname(directory)}/**/*.s?(a|c)ss`;
    if (validStylelintDirectories.indexOf(newPath) === -1) {
      validStylelintDirectories.push(newPath);
    }
    const newPathRoot = `${path.dirname(directory)}/*.s?(a|c)ss`;
    if (validStylelintDirectories.indexOf(newPathRoot) === -1) {
      validStylelintDirectories.push(newPathRoot);
    }
  }
}

const webpackConfig = {
  context: config.paths.assets,
  entry: config.entry,
  target: isDevelopmentServer ? 'web' : 'browserslist',
  devtool: config.enabled.sourceMaps ? 'source-map' : false,
  output: {
    path: config.paths.dist,
    publicPath,
    filename: `scripts/${assetsFilenames}.js`,
  },
  stats: {
    hash: false,
    logging: 'warn',
    version: false,
    timings: true,
    children: false,
    errors: true,
    errorDetails: true,
    warnings: true,
    chunks: false,
    modules: false,
    reasons: false,
    source: false,
    publicPath: false,
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|vue)?$/,
        include: config.paths.assets,
        exclude: [
          /(node_modules|bower_components)(?![/\\|](bootstrap|foundation-sites))/,
        ],
        loader: 'eslint-loader',
        options: { fix: true },
      },
      {
        test: /\.js$/,
        exclude: [
          /(node_modules|bower_components)(?![/\\|](bootstrap|foundation-sites))/,
        ],
        loader: isDevelopmentServer ? 'babel-loader' : 'esbuild-loader',
        options: isDevelopmentServer
          ? {}
          : {
              target: 'es2015', // Syntax to compile to (see options below for possible values)
            },
      },
      {
        test: /\.jsx$/,
        exclude: [
          /(node_modules|bower_components)(?![/\\|](bootstrap|foundation-sites))/,
        ],
        loader: isDevelopmentServer ? 'babel-loader' : 'esbuild-loader',
        options: isDevelopmentServer
          ? {}
          : {
              loader: 'jsx', // Remove this if you're not using JSX
              target: 'es2015', // Syntax to compile to (see options below for possible values)
            },
      },
      {
        test: /\.ts$/,
        exclude: [
          /(node_modules|bower_components)(?![/\\|](bootstrap|foundation-sites))/,
        ],
        loader: isDevelopmentServer ? 'ts-loader' : 'esbuild-loader',
        options: isDevelopmentServer
          ? {}
          : {
              loader: 'ts',
              target: 'es2015',
            },
      },
      {
        test: /\.tsx$/,
        exclude: [
          /(node_modules|bower_components)(?![/\\|](bootstrap|foundation-sites))/,
        ],
        loader: isDevelopmentServer ? 'ts-loader' : 'esbuild-loader',
        options: isDevelopmentServer
          ? {}
          : {
              loader: 'tsx',
              target: 'es2015',
            },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.s?[ac]ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: (resourcePath) => {
                if (isDevelopmentServer) {
                  return '/';
                  //return `/${config.distPath}/`;
                }
                if (/^\.\//.test(config.publicPath)) {
                  return path.join(
                    path.relative(
                      path.dirname(resourcePath),
                      config.paths.relative
                    ),
                    config.publicPath
                  );
                }
                return config.publicPath;
              },
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              esModule: true,
              sourceMap: config.enabled.sourceMaps,
            },
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: config.enabled.sourceMaps },
          },
          'resolve-url-loader',
          {
            loader: 'sass-loader',
            options: { sourceMap: true },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|mp4|ogv|webp)$/,
        include: config.paths.assets,
        type: 'asset/resource',
      },
      {
        test: /\.(ttf|eot)$/,
        include: config.paths.assets,
        type: 'asset/resource',
      },
      {
        test: /\.woff2?$/,
        include: config.paths.assets,
        type: isDevelopmentServer ? 'asset/resource' : 'asset',
      },
      {
        test: /\.pug$/,
        oneOf: [
          {
            resourceQuery: /^\?vue/,
            use: ['pug-plain-loader'],
          },
          {
            use: {
              loader: 'pug-loader',
              options: { self: true, pretty: !config.env.production },
            },
          },
        ],
      },
      {
        test: /\.twig$/,
        loader: 'twig-loader',
      },
      {
        test: /\.(njk|nunjucks)$/,
        loader: 'nunjucks-loader',
      },
    ],
  },
  resolve: {
    modules: [config.paths.assets, 'node_modules', 'bower_components'],
    enforceExtension: false,
    alias: config.resolveAlias,
  },
  externals: {
    window: 'window',
    jquery: 'jQuery',
    SparkForm: 'SparkForm',
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: { drop_console: config.env.production },
        },
      }),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __TIMESTAMP__: Date.now(),
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: profiler ? 'static' : 'disabled',
    }),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
    new CleanWebpackPlugin({
      dry: isDevelopmentServer,
      verbose: isDevelopmentServer,
      dangerouslyAllowCleanPatternsOutsideProject: isDevelopmentServer,
    }),
    new MiniCssExtractPlugin({
      filename: `styles/${assetsFilenames}.css`,
    }),
    //new OptimizeCssAssetsPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Tether: 'tether',
      'window.Tether': 'tether',
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: config.enabled.optimize,
      debug: config.enabled.watcher,
      stats: { colors: true },
    }),
    new webpack.LoaderOptionsPlugin({
      test: /\.s?css$/,
      options: {
        output: { path: config.paths.dist },
        context: config.paths.assets,
        postcss: [autoprefixer()],
      },
    }),
    new webpack.LoaderOptionsPlugin({
      test: /\.jsx?$/,
      options: {
        eslint: {
          failOnWarning: false,
          failOnError: true,
        },
      },
    }),
    new StyleLintPlugin({
      failOnError: !config.enabled.watcher,
      customSyntax: require('postcss-scss'),
      files: validStylelintDirectories,
      formatter: require('stylelint-formatter-pretty'),
      emitErrors: true,
      fix: true,
    }),
    /*new ServiceWorkerWebpackPlugin({
            entry: path.join(__dirname, `../${config.swPath}`),
            filename: '../sw.js',
            publicPath: config.publicPath,
            transformOptions: serviceWorkerOption => ({
                assets: serviceWorkerOption.assets,
                version: gitInfo.toString(),
            }),
        }),*/
    new VueLoaderPlugin(),
  ],
  // eslint-disable-next-line unicorn/prevent-abbreviations
  devServer: {
    headers: { 'Access-Control-Allow-Origin': '*' },
    https: true,
    allowedHosts: 'all',
    static: {
      publicPath: config.devUrl,
    },
    compress: false,
    host: 'localhost',
    port: config.devServerPort,
    client: {
      overlay: true,
    },
    devMiddleware: {
      writeToDisk: (filePath) => {
        return /\.(png|jpe?g|gif|svg|ttf|eot|woff2?)$/.test(filePath);
      },
    },
  },
};

if (config.copy.length > 0) {
  webpackConfig.plugins.push(new CopyWebpackPlugin({ patterns: config.copy }));
}

const walk = function (directory, extension) {
  let results = [];
  const list = fs.readdirSync(directory);

  // eslint-disable-next-line unicorn/no-array-for-each
  list.forEach((file) => {
    file = `${directory}/${file}`;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory() && path.basename(file).indexOf('_') !== 0) {
      /* Recurse into a subdirectory */
      results = [...results, ...walk(file, extension)];
    } else if (
      stat &&
      !stat.isDirectory() &&
      path.extname(file) === extension &&
      path.basename(file).indexOf('_') !== 0
    ) {
      /* Is a file */
      results.push(file);
    }
  });
  return results;
};

//start looking in the main twig folder

let staticCount = 0;

if (typeof config.twigDir != 'undefined') {
  const twigFiles = walk(config.twigDir, '.twig');
  twigFiles.map((file) => {
    staticCount++;
    const basedir = config.htmlOutput;
    const filename =
      config.htmlOutput +
      file
        .replace(`${config.twigDir}/`, '')
        .replace(config.twigDir, '')
        .replace('.twig', '.html');
    const directories = path.relative(basedir, filename).split(path.sep);
    const parentPath = '../';
    const base =
      directories.length > 1
        ? parentPath.repeat(directories.length - 1)
        : false;
    webpackConfig.plugins.push(
      new HtmlWebpackPlugin({
        filename,
        template: path.resolve(file),
        hash: false,
        showErrors: true,
        xhtml: true,
        base,
        alwaysWriteToDisk: isDevelopmentServer,
      })
    );
  });
}

if (typeof config.pugDir != 'undefined') {
  const pugFiles = walk(config.pugDir, '.pug');
  pugFiles.map((file) => {
    staticCount++;
    const basedir = config.htmlOutput;
    const filename =
      config.htmlOutput +
      file
        .replace(`${config.pugDir}/`, '')
        .replace(config.pugDir, '')
        .replace('.pug', '.html');
    const directories = path.relative(basedir, filename).split(path.sep);
    const parentPath = '../';
    const base =
      directories.length > 1
        ? parentPath.repeat(directories.length - 1)
        : false;
    webpackConfig.plugins.push(
      new HtmlWebpackPlugin({
        filename,
        environment: process.env.NODE_ENV,
        template: path.resolve(file),
        hash: false,
        showErrors: true,
        xhtml: true,
        base,
        alwaysWriteToDisk: isDevelopmentServer,
      })
    );
  });
}

if (typeof config.staticHtml != 'undefined' && config.staticHtml.length > 0) {
  config.staticHtml.forEach((config) => {
    staticCount++;
    webpackConfig.plugins.push(new HtmlWebpackPlugin(config));
  });
}

if (staticCount > 0 && isDevelopmentServer) {
  webpackConfig.plugins.push(new HtmlWebpackHarddiskPlugin());
}

/* eslint-disable global-require */
/** Let's only load dependencies as needed */

if (config.env.production) {
  webpackConfig.plugins.push(new webpack.NoEmitOnErrorsPlugin());
}

webpackConfig.plugins.push(
  new WebpackManifestPlugin({
    publicPath,
    basePath: config.publicPath,
    fileName: config.manifestPath,
    writeToFileEmit: isDevelopmentServer,
    filter: (file) => !/\.(LICENSE|scss|map)/.test(file.name),
    map: (file) => {
      if (file.isAsset) {
        return file;
      }
      const filename = path.basename(file.name);
      //const sourcePath = path.basename(path.dirname(file.name));
      const targetPath = path.basename(path.dirname(file.path));
      file.name = `${config.publicPath}${targetPath}/${filename}`;
      return file;
    },
  })
);

module.exports = webpackConfig;
