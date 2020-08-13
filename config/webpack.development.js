const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { NamedModulesPlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const PrettierPlugin = require('prettier-webpack-plugin');
const {
    paths: { resolve, src, dist },
    loaders: { style },
} = require('./utils');

const rendererProcessConfig = {
    name: 'renderer',
    mode: 'development',
    devtool: 'source-map',
    performance: {
        hints: 'warning',
        maxEntrypointSize: 400000,
        maxAssetSize: 400000,
    },
    target: 'web',
    entry: src('renderer', 'index.js'),
    output: {
        filename: 'index.[hash:8].js',
        path: dist('renderer'),
    },
    resolve: {
        alias: {
            '@shared': src('shared'),
        },
    },
    module: {
        rules: [
            {
                parser: {
                    requireEnsure: false,
                },
            },
            {
                test: /\.jsx?$/,
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
                            plugins: ['css-modules'],
                            rules: {
                                'css-modules/no-unused-class': 'error',
                                'css-modules/no-undef-class': 'warn',
                                'jsx-a11y/href-no-hash': 0,
                            },
                        },
                    },
                ],
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            presets: [
                                [
                                    '@babel/preset-env',
                                    {
                                        targets: {
                                            chrome: '61',
                                        },
                                    },
                                ],
                                '@babel/preset-react',
                            ],
                            plugins: [
                                '@babel/plugin-transform-runtime',
                                '@babel/plugin-proposal-object-rest-spread',
                                'react-hot-loader/babel',
                            ],
                        },
                    },
                ],
            },
            {
                test: /\.s?css$/,
                oneOf: [
                    {
                        test: /\.css$/,
                        exclude: /\.module\.css$/,
                        use: style({
                            sourceMap: true,
                            importLoaders: 1,
                        }),
                    },
                    {
                        test: /\.module\.css$/,
                        use: style({
                            sourceMap: true,
                            importLoaders: 1,
                            modules: true,
                        }),
                    },
                    {
                        test: /\.(sc|sa)ss/,
                        exclude: /\.module\.(sc|sa)ss/,
                        use: style(
                            {
                                sourceMap: true,
                                importLoaders: 2,
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: true,
                                },
                            },
                        ),
                    },
                    {
                        test: /\.module\.(sc|sa)ss/,
                        use: style(
                            {
                                sourceMap: true,
                                importLoaders: 2,
                                modules: true,
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: true,
                                },
                            },
                        ),
                    },
                ],
            },
            {
                test: /\.((pn|jpe?|sv)g|gif|bmp)$/i,
                use: ['url-loader'],
            },
        ],
    },
    plugins: [
        new PrettierPlugin({
            ...require('./prettier'),
            encoding: 'utf-8',
            extensions: ['.js', '.jsx', '.css', '.scss', '.sass', '.json'],
        }),
        new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: dist('renderer') }),
        new NamedModulesPlugin(),
        new HtmlWebPackPlugin({
            template: src('renderer', 'index.html'),
            filename: 'index.html',
            minify: false,
        }),
    ],
};

const mainProcessConfig = {
    name: 'main',
    mode: 'development',
    devtool: 'source-map',
    performance: false,
    target: 'electron-main',
    entry: {
        index: src('main', 'index.js'),
        preload: src('main', 'preload.js'),
    },
    output: {
        filename: '[name].js',
        path: dist('main'),
    },
    resolve: {
        alias: {
            '@shared': src('shared'),
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
                                'eol-last': ['error', 'always'],
                                'jsx-a11y/href-no-hash': 0,
                            },
                        },
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
                                [
                                    '@babel/preset-env',
                                    {
                                        targets: {
                                            node: '8.9',
                                        },
                                    },
                                ],
                            ],
                            plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-object-rest-spread'],
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new PrettierPlugin({
            ...require('./prettier'),
            encoding: 'utf-8',
            extensions: ['.js', '.jsx', '.css', '.scss', '.sass', '.json'],
        }),
        new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: dist('main') }),
        new CopyWebpackPlugin([
            {
                from: resolve('electron.json'),
                to: dist('package.json'),
                transform: content => {
                    const { name, version, author, homepage, repository } = require('../package.json');

                    return JSON.stringify({
                        ...JSON.parse(content),
                        name,
                        version,
                        author,
                        homepage: homepage || repository.url,
                    });
                },
            },
        ]),
    ],
    node: {
        __dirname: false,
        __filename: false,
    },
};

module.exports = [rendererProcessConfig, mainProcessConfig];
