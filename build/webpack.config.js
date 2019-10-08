/* eslint "import/no-commonjs": "off" */
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
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const { gitDescribeSync } = require('git-describe');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const open = require('open');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const config = require('./config');
const gitInfo = gitDescribeSync(__dirname);

const assetsFilenames = config.enabled.cacheBusting
    ? config.cacheBusting
    : '[name]';

const profiler = process.argv.indexOf('--profile') !== -1;

const isDevelopmentServer = process.argv[1].indexOf('webpack-dev-server') !== -1;
const publicPath = isDevelopmentServer ? 'https://localhost:8080/' : config.publicPath;

if (isDevelopmentServer){
    open(config.devUrl);
}

const webpackConfig = {
    context: config.paths.assets,
    entry: config.entry,
    devtool: config.enabled.sourceMaps ? 'source-map' : 'nosources-source-map',
    output: {
        path: config.paths.dist,
        publicPath,
        filename: `scripts/${assetsFilenames}.js`,
    },
    stats: {
        hash: false,
        version: false,
        timings: false,
        children: false,
        errors: false,
        errorDetails: false,
        warnings: false,
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
                    /(node_modules|bower_components)(?![/|\\](bootstrap|foundation-sites))/,
                ],
                loader: 'eslint-loader',
                options: {
                    fix: true,
                },
            },
            {
                test: /\.js$/,
                exclude: [
                    /(node_modules|bower_components)(?![/|\\](bootstrap|foundation-sites))/,
                ],
                loader: 'babel-loader',
                options: {},
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.s?[ac]ss$/,
                include: config.paths.assets,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            implementation: require('sass'),
                            sassOptions: {
                                fiber: require('fibers'),
                            },
                            hmr: isDevelopmentServer,
                            reloadAll: true,
                        },
                    },
                    'css-loader',
                    'postcss-loader',
                    'resolve-url-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                include: config.paths.assets,
                loader: 'file-loader',
                options: {
                    name: `images/${assetsFilenames}.[ext]`,
                },
            },
            {
                test: /\.(ttf|eot)$/,
                include: config.paths.assets,
                loader: 'file-loader',
                options: {
                    name: `fonts/${assetsFilenames}.[ext]`,
                },
            },
            {
                test: /\.woff2?$/,
                include: config.paths.assets,
                loader: 'url',
                options: {
                    limit: 10000,
                    mimetype: 'application/font-woff',
                    name: `fonts/${assetsFilenames}.[ext]`,
                },
            },
            {
                test: /\.modernizrrc.js$/,
                loader: 'modernizr',
            },
            {
                test: /\.modernizrrc(\.json)?$/,
                loader: 'modernizr!json',
            },
            { test: /\.json$/, loader: 'json-loader' },
            {
                test: /\.pug$/,
                loader: 'pug-loader',
            },
            {
                test: /\.twig$/,
                loader: 'twig-loader',
                options: {
                    // See options section below
                },
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
        alias: {
            modernizr: config.paths.modernizr,
            vue$: 'vue/dist/vue.esm.js',
            masonry: 'masonry-layout',
            isotope: 'isotope-layout',
        },
    },
    resolveLoader: {
        moduleExtensions: ['-loader'],
    },
    externals: {
        window: 'window',
        jquery: 'jQuery',
        SparkForm: 'SparkForm',
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                terserOptions: {
                    compress: {
                        drop_console: config.env.production,
                    },
                },
            }),
        ],
    },
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: profiler ? 'static' : 'disabled',
        }),
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
        new CleanWebpackPlugin({
            verbose: false,
        }),
        new MiniCssExtractPlugin({
            filename: `styles/${assetsFilenames}.css`,
            allChunks: true,
            disable: config.enabled.watcher,
        }),
        //new OptimizeCssAssetsPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            Modernizr: 'modernizr',
            'window.jQuery': 'jquery',
            Tether: 'tether',
            'window.Tether': 'tether',
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: config.enabled.optimize,
            debug: config.enabled.watcher,
            stats: {
                colors: true,
            },
        }),
        new webpack.LoaderOptionsPlugin({
            test: /\.s?css$/,
            options: {
                output: {
                    path: config.paths.dist,
                },
                context: config.paths.assets,
                postcss: [autoprefixer()],
            },
        }),
        new webpack.LoaderOptionsPlugin({
            test: /\.js$/,
            options: {
                eslint: {
                    failOnWarning: false,
                    failOnError: true,
                },
            },
        }),
        new StyleLintPlugin({
            failOnError: !config.enabled.watcher,
            syntax: 'scss',
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
        new CopyWebpackPlugin(config.copy, { manifest: config.manifest }),
        new VueLoaderPlugin(),
    ],
    // eslint-disable-next-line unicorn/prevent-abbreviations
    devServer: {
        headers: {
            'Access-Control-Allow-Origin': config.devUrl,
        },
        https: true,
        disableHostCheck: true,
        publicPath: config.devUrl,
        compress: false,
        sockPort: 8080,
        overlay: true,        
    },
};

const walk = function(directory, extension) {
    let results = [];
    const list = fs.readdirSync(directory);

    list.forEach(file => {
        file = `${directory}/${file}`;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory() && path.basename(file).indexOf('_') !== 0) {
            /* Recurse into a subdirectory */
            results = results.concat(walk(file));
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

if (typeof config.twigDir != 'undefined'){
    const twigFiles = walk(config.twigDir, '.twig');
    twigFiles.map(
        file => {
            staticCount++;
            webpackConfig.plugins.push(
                new HtmlWebpackPlugin({
                    filename: config.htmlOutput+file.replace(`${config.twigDir}/`, '').replace(config.twigDir, '').replace('.twig', '.html'),
                    template: path.resolve(file),
                    hash: false,
                    showErrors: true,
                    xhtml: true,
                    alwaysWriteToDisk: isDevelopmentServer,
                }));
        }
    );    
}

if (typeof config.pugDir != 'undefined'){
    const pugFiles = walk(config.pugDir, '.pug');
    pugFiles.map(
        file => {
            staticCount++;
            webpackConfig.plugins.push(
                new HtmlWebpackPlugin({
                    filename: config.htmlOutput+file.replace(`${config.pugDir}/`, '').replace(config.pugDir, '').replace('.pug', '.html'),
                    template: path.resolve(file),
                    hash: false,
                    showErrors: true,
                    xhtml: true,
                    alwaysWriteToDisk: isDevelopmentServer,
                }));
        }
    );    
}

if (typeof config.staticHtml != 'undefined' && config.staticHtml.length > 0){
    config.staticHtml.forEach(config => {
        staticCount++;
        webpackConfig.plugins.push(new HtmlWebpackPlugin(config));
    });
}

if (staticCount > 0 && isDevelopmentServer){
    webpackConfig.plugins.push(new HtmlWebpackHarddiskPlugin());
}

/* eslint-disable global-require */
/** Let's only load dependencies as needed */

if (config.env.production) {
    webpackConfig.plugins.push(new webpack.NoEmitOnErrorsPlugin());
}

webpackConfig.plugins.push(
    new WebpackAssetsManifest({
        publicPath,
        output: config.manifestPath,
        space: 2,
        writeToDisk: isDevelopmentServer,
        assets: config.manifest,
        replacer: require('./util/assetManifestsFormatter'),
    })
);

module.exports = webpackConfig;
