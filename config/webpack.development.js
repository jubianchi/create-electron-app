const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { NamedModulesPlugin } = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const make = (...parts) => parts.filter(part => !!part);
const resolve = (...parts) => path.resolve(...make(__dirname, ...parts));
const src = (process, ...parts) => resolve('..', 'src', process, ...parts);
const dist = (process, ...parts) => resolve('..', 'dist', process, ...parts);

const style = (cssOptions, preProcessor) => {
    const loaders = [
        require.resolve('style-loader'),
        {
            loader: require.resolve('css-loader'),
            options: {
                ...cssOptions,
                sourceMap: true,
            },
        }
    ];

    if (preProcessor) {
        loaders.push(preProcessor);
    }

    return loaders;
};

const rendererProcessConfig = {
    name: 'renderer',
    mode: 'development',
    devtool: 'source-map',
    performance: {
        hints: 'warning',
        maxEntrypointSize: 400000,
        maxAssetSize: 400000,
    },
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
                                "react"
                            ],
                            plugins: [
                                'transform-object-rest-spread',
                                'react-hot-loader/babel',
                            ],
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
                        }, {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }),
                    },
                    {
                        test: /\.module\.(sc|sa)ss/,
                        use: style({
                            importLoaders: 2,
                            modules: true,
                        }, {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }),
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
        new CleanWebpackPlugin(['renderer'], { root: dist() }),
        new NamedModulesPlugin(),
        new HtmlWebPackPlugin({
            template: src('renderer', 'index.html'),
            filename: 'index.html',
            minify: false,
        }),
    ],
    node: {
        fs: false
    },
};

const mainProcessConfig = {
    name: 'main',
    mode: 'development',
    performance: false,
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
                                'transform-object-rest-spread'
                            ]
                        },
                    }
                ],
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['main'], { root: dist() }),
        new CopyWebpackPlugin([{
            from: resolve('electron.json'),
            to: dist('package.json'),
            transform: (content) => {
                const { name, version } = require('../package.json');

                return JSON.stringify({
                    ...JSON.parse(content),
                    name,
                    version
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
