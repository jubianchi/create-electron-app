const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
    presets: [
        'env',
    ],
    plugins: [
        'transform-object-rest-spread',
    ],
});
