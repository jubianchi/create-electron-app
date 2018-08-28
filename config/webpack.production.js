const HtmlWebPackPlugin = require('html-webpack-plugin');
const { NamedModulesPlugin } = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { paths : { resolve, src, dist }, loaders: { style } } = require('./utils');

const rendererProcessConfig = {
    name: 'renderer',
    mode: 'production',
    devtool: false,
    performance: {
        hints: 'error',
        maxEntrypointSize: 400000,
        maxAssetSize: 400000,
    },
    bail: true,
    //target: 'electron-renderer',
    target: 'web',
    entry: src('renderer', 'index.js'),
    output: {
        filename: 'index.[hash:8].js',
        path: dist('renderer'),
    },
    resolve: {
        alias: {
            shared: src('shared')
        },
    },
    module: {
        rules: [
            {
                parser: {
                    requireEnsure: false,
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                enforce: 'pre',
                use: [
                    {
                        loader: 'eslint-loader',
                        options: {
                            cache: true,
                            failOnError: true,
                            configFile: require.resolve('eslint-config-react-app'),
                            rules: {
                                'eol-last': ["error", "always"]
                            },
                        }
                    },
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            presets: [
                                'react'
                            ],
                            plugins: [
                                'babel-plugin-transform-runtime',
                                'transform-object-rest-spread',
                            ]
                        },
                    }
                ],
            },
            {
                test: /\.s?css$/,
                oneOf: [
                    {
                        test: /\.css$/,
                        exclude: /\.module\.css$/,
                        use: style({
                            importLoaders: 1,
                        }),
                    },{
                        test: /\.module\.css$/,
                        use: style({
                            importLoaders: 1,
                            modules: true,
                        }),
                    },
                    {
                        test: /\.(sc|sa)ss/,
                        exclude: /\.module\.(sc|sa)ss/,
                        use: style({
                            importLoaders: 2,
                        }, 'sass-loader'),
                    },
                    {
                        test: /\.module\.(sc|sa)ss/,
                        use: style({
                            importLoaders: 2,
                            modules: true,
                        }, 'sass-loader'),
                    },
                ],
            },
            {
                test: /\.((pn|jpe?|sv)g|gif|bmp)$/i,
                use: ['url-loader'],
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['*'], { root: dist() }),
        new NamedModulesPlugin(),
        new HtmlWebPackPlugin({
            template: src('renderer', 'index.html'),
            filename: 'index.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
        }),
    ],
};

const mainProcessConfig = {
    name: 'main',
    mode: 'production',
    devtool: false,
    performance: false,
    bail: true,
    target: 'electron-main',
    entry: {
        index: src('main', 'index.js'),
        preload: src('main', 'preload.js')
    },
    output: {
        filename: '[name].js',
        path: dist('main'),
    },
    resolve: {
        alias: {
            shared: src('shared')
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                enforce: 'pre',
                use: [
                    {
                        loader: 'eslint-loader',
                        options: {
                            cache: true,
                            failOnError: true,
                            fix: true,
                            configFile: require.resolve('eslint-config-react-app'),
                            rules: {
                                'eol-last': ["error", "always"]
                            },
                        }
                    },
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            presets: [
                                ['env', {
                                    targets: {
                                        node: "8.9"
                                    }
                                }]
                            ],
                            plugins: [
                                'babel-plugin-transform-runtime',
                                'transform-object-rest-spread'
                            ]
                        },
                    }
                ],
            },
        ]
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: resolve('electron.json'),
            to: dist('package.json'),
            transform: (content) => {
                const { name, version, author, homepage, repository } = require('../package.json');

                return JSON.stringify({
                    ...JSON.parse(content),
                    name,
                    version,
                    author,
                    homepage: homepage || repository.url
                })
            }
        }]),
    ],
    node: {
        __dirname: false,
        __filename: false
    },
};

module.exports = [
    rendererProcessConfig,
    mainProcessConfig,
];
