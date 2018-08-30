const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
    presets: ['@babel/preset-env'],
    plugins: ['@babel/plugin-proposal-object-rest-spread'],
});
