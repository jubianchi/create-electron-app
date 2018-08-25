const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
    presets: [
        'env',
        'react',
    ],
    plugins: [
        'transform-object-rest-spread',
    ],
});
