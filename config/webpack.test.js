const { DefinePlugin } = require('webpack');
const [rendererProcessConfig, mainProcessConfig] = require('./webpack.production');

module.exports = [
    {
        ...rendererProcessConfig,
        devtool: 'cheap-source-map',
        bail: false,
    },
    {
        ...mainProcessConfig,
        devtool: 'cheap-source-map',
        bail: false,
        plugins: [
            new DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            }),
            ...mainProcessConfig.plugins,
        ],
    },
];
