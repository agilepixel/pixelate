var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/*! Agile Pixel https://agilepixel.io - 2022*/
var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var TerserPlugin = require('terser-webpack-plugin');
var autoprefixer = require('autoprefixer');
var CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var StyleLintPlugin = require('stylelint-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
//const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var openWindow = require('open');
var WebpackManifestPlugin = require('webpack-manifest-plugin').WebpackManifestPlugin;
var HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
var ESLintPlugin = require('eslint-webpack-plugin');
var VueLoaderPlugin = require('vue-loader').VueLoaderPlugin;
var SubresourceIntegrityPlugin = require('webpack-subresource-integrity').SubresourceIntegrityPlugin;
var config = require('./config');
var assetsFilenames = config.enabled.cacheBusting
    ? config.cacheBusting
    : '[name]';
var profiler = process.argv.indexOf('--profile') !== -1;
var isDevelopmentServer = process.argv.indexOf('serve') !== -1;
var publicPath = isDevelopmentServer
    ? "https://localhost:".concat(config.devServerPort, "/")
    : config.publicPath;
if (isDevelopmentServer) {
    openWindow(config.devUrl);
}
var entryKeys = Object.keys(config.entry);
var validStylelintDirectories = [];
for (var _i = 0, entryKeys_1 = entryKeys; _i < entryKeys_1.length; _i++) {
    var entryKey = entryKeys_1[_i];
    for (var _a = 0, _b = config.entry[entryKey]; _a < _b.length; _a++) {
        var directory = _b[_a];
        var newPath = "".concat(path.dirname(directory), "/**/*.s?(a|c)ss");
        if (validStylelintDirectories.indexOf(newPath) === -1) {
            validStylelintDirectories.push(newPath);
        }
        var newPathRoot = "".concat(path.dirname(directory), "/*.s?(a|c)ss");
        if (validStylelintDirectories.indexOf(newPathRoot) === -1) {
            validStylelintDirectories.push(newPathRoot);
        }
    }
}
var webpackConfig = {
    context: config.paths.assets,
    entry: config.entry,
    target: isDevelopmentServer ? 'web' : 'browserslist',
    devtool: config.enabled.sourceMaps ? 'source-map' : false,
    output: {
        path: config.paths.dist,
        publicPath: publicPath,
        filename: config.flatten
            ? "".concat(assetsFilenames, ".js")
            : "scripts/".concat(assetsFilenames, ".js"),
        crossOriginLoading: 'anonymous'
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
        publicPath: false
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [
                    /(node_modules|bower_components)(?![/\\|](bootstrap|foundation-sites))/,
                ],
                loader: isDevelopmentServer ? 'babel-loader' : 'esbuild-loader',
                options: isDevelopmentServer
                    ? {}
                    : {
                        target: 'es2015'
                    },
                generator: {
                //outputPath: '',
                }
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
                        loader: 'jsx',
                        target: 'es2015'
                    },
                generator: {
                //outputPath: '',
                }
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
                        target: 'es2015'
                    },
                generator: {
                //outputPath: '',
                }
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
                        target: 'es2015'
                    },
                generator: {
                //outputPath: '',
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                generator: {
                //outputPath: '',
                }
            },
            {
                test: /\.s?[ac]ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: function (resourcePath) {
                                if (isDevelopmentServer) {
                                    return '/';
                                    //return `/${config.distPath}/`;
                                }
                                if (/^\.\//.test(config.publicPath)) {
                                    return path.join(path.relative(path.dirname(resourcePath), config.paths.relative), config.publicPath);
                                }
                                return config.publicPath;
                            }
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            esModule: true,
                            sourceMap: config.enabled.sourceMaps
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: { sourceMap: config.enabled.sourceMaps }
                    },
                    'resolve-url-loader',
                    {
                        loader: 'sass-loader',
                        options: { sourceMap: true }
                    },
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg|mp4|ogv|webp)$/,
                include: config.paths.assets,
                type: 'asset/resource',
                generator: {
                //outputPath: '',
                }
            },
            {
                test: /\.(ttf|eot)$/,
                include: config.paths.assets,
                type: 'asset/resource',
                generator: {
                //outputPath: '',
                }
            },
            {
                test: /\.woff2?$/,
                include: config.paths.assets,
                type: isDevelopmentServer ? 'asset/resource' : 'asset',
                generator: {
                //outputPath: '',
                }
            },
            {
                test: /\.pug$/,
                oneOf: [
                    {
                        resourceQuery: /^\?vue/,
                        use: ['pug-plain-loader']
                    },
                    {
                        use: {
                            loader: 'pug-loader',
                            options: { self: true, pretty: !config.env.production }
                        }
                    },
                ]
            },
            {
                test: /\.twig$/,
                loader: 'twig-loader'
            },
            {
                test: /\.(njk|nunjucks)$/,
                loader: 'nunjucks-loader'
            },
        ]
    },
    resolve: {
        modules: [config.paths.assets, 'node_modules', 'bower_components'],
        enforceExtension: false,
        alias: config.resolveAlias,
        extensions: ['.jsx', '.ts', '.tsx', '...']
    },
    externals: {
        window: 'window',
        jquery: 'jQuery',
        SparkForm: 'SparkForm'
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    compress: { drop_console: config.env.production }
                }
            }),
        ],
        realContentHash: true
    },
    plugins: [
        new webpack.DefinePlugin({
            __TIMESTAMP__: Date.now()
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: profiler ? 'static' : 'disabled'
        }),
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
        new CleanWebpackPlugin({
            dry: config.noCleaning || isDevelopmentServer,
            verbose: isDevelopmentServer,
            dangerouslyAllowCleanPatternsOutsideProject: isDevelopmentServer
        }),
        new ESLintPlugin({
            extensions: ['js', 'jsx', 'vue'],
            exclude: ['node_modules', 'bower_components'],
            fix: true
        }),
        new MiniCssExtractPlugin({
            filename: config.flatten
                ? "".concat(assetsFilenames, ".css")
                : "styles/".concat(assetsFilenames, ".css")
        }),
        //new OptimizeCssAssetsPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Tether: 'tether',
            'window.Tether': 'tether'
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: config.enabled.optimize,
            debug: config.enabled.watcher,
            stats: { colors: true }
        }),
        new webpack.LoaderOptionsPlugin({
            test: /\.s?css$/,
            options: {
                output: { path: config.paths.dist },
                context: config.paths.assets,
                postcss: [autoprefixer()]
            }
        }),
        new webpack.LoaderOptionsPlugin({
            test: /\.jsx?$/,
            options: {
                eslint: {
                    failOnWarning: false,
                    failOnError: true
                }
            }
        }),
        new StyleLintPlugin({
            failOnError: !config.enabled.watcher,
            customSyntax: require('postcss-scss'),
            files: validStylelintDirectories,
            formatter: require('stylelint-formatter-pretty'),
            emitErrors: true,
            fix: true
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
            publicPath: config.devUrl
        },
        compress: false,
        host: 'localhost',
        port: config.devServerPort,
        client: {
            overlay: {
                errors: true,
                warnings: false
            }
        },
        devMiddleware: {
            writeToDisk: function (filePath) {
                return /\.(png|jpe?g|gif|svg|ttf|eot|woff2?)$/.test(filePath);
            }
        }
    }
};
if (config.copy.length > 0) {
    webpackConfig.plugins.push(new CopyWebpackPlugin({ patterns: config.copy }));
}
var walk = function (directory, extension) {
    var results = [];
    var list = fs.readdirSync(directory);
    // eslint-disable-next-line unicorn/no-array-for-each
    list.forEach(function (file) {
        file = "".concat(directory, "/").concat(file);
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory() && path.basename(file).indexOf('_') !== 0) {
            /* Recurse into a subdirectory */
            results = __spreadArray(__spreadArray([], results, true), walk(file, extension), true);
        }
        else if (stat &&
            !stat.isDirectory() &&
            path.extname(file) === extension &&
            path.basename(file).indexOf('_') !== 0) {
            /* Is a file */
            results.push(file);
        }
    });
    return results;
};
//start looking in the main twig folder
var staticCount = 0;
if (typeof config.twigDir != 'undefined') {
    var twigFiles = walk(config.twigDir, '.twig');
    twigFiles.map(function (file) {
        staticCount++;
        var basedir = config.htmlOutput;
        var filename = config.htmlOutput +
            file
                .replace("".concat(config.twigDir, "/"), '')
                .replace(config.twigDir, '')
                .replace('.twig', '.html');
        var directories = path.relative(basedir, filename).split(path.sep);
        var parentPath = '../';
        var base = directories.length > 1
            ? parentPath.repeat(directories.length - 1)
            : false;
        webpackConfig.plugins.push(new HtmlWebpackPlugin({
            filename: filename,
            template: path.resolve(file),
            hash: false,
            showErrors: true,
            xhtml: true,
            base: base,
            alwaysWriteToDisk: isDevelopmentServer
        }));
    });
}
if (typeof config.pugDir != 'undefined') {
    var pugFiles = walk(config.pugDir, '.pug');
    pugFiles.map(function (file) {
        staticCount++;
        var basedir = config.htmlOutput;
        var filename = config.htmlOutput +
            file
                .replace("".concat(config.pugDir, "/"), '')
                .replace(config.pugDir, '')
                .replace('.pug', '.html');
        var directories = path.relative(basedir, filename).split(path.sep);
        var parentPath = '../';
        var base = directories.length > 1
            ? parentPath.repeat(directories.length - 1)
            : false;
        console.log(filename);
        webpackConfig.plugins.push(new HtmlWebpackPlugin({
            filename: filename,
            environment: process.env.NODE_ENV,
            template: path.resolve(file),
            hash: false,
            showErrors: true,
            xhtml: true,
            base: base,
            alwaysWriteToDisk: isDevelopmentServer
        }));
    });
}
if (typeof config.staticHtml != 'undefined' && config.staticHtml.length > 0) {
    config.staticHtml.forEach(function (config) {
        staticCount++;
        webpackConfig.plugins.push(new HtmlWebpackPlugin(config));
    });
}
if (staticCount > 0 && isDevelopmentServer) {
    webpackConfig.plugins.push(new HtmlWebpackHarddiskPlugin());
}
if (!isDevelopmentServer) {
    webpackConfig.plugins.push(new SubresourceIntegrityPlugin());
}
/* eslint-disable global-require */
/** Let's only load dependencies as needed */
if (config.env.production) {
    webpackConfig.plugins.push(new webpack.NoEmitOnErrorsPlugin());
}
webpackConfig.plugins.push(new WebpackManifestPlugin({
    publicPath: publicPath,
    basePath: config.publicPath,
    fileName: config.manifestPath,
    writeToFileEmit: isDevelopmentServer,
    filter: function (file) { return !/\.(LICENSE|scss|map)/.test(file.name); },
    map: function (file) {
        if (file.isAsset) {
            return file;
        }
        var filename = path.basename(file.name);
        //const sourcePath = path.basename(path.dirname(file.name));
        var targetPath = path.basename(path.dirname(file.path));
        file.name = "".concat(config.publicPath).concat(targetPath, "/").concat(filename);
        return file;
    }
}));
module.exports = webpackConfig;
