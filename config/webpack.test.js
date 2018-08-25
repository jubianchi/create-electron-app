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
    },
];
