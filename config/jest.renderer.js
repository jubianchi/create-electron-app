const path = require('path');

module.exports = {
    rootDir: path.resolve(__dirname, '..', 'src', 'renderer'),
    testMatch: [
        '**/*.spec.js?(x)',
        '**/*.test.js?(x)',
    ],
    setupTestFrameworkScriptFile: path.resolve(__dirname, 'jest', 'setup.renderer.js'),
    testEnvironment: 'node',
    transform: {
        '^.+\\.jsx?$': path.resolve(__dirname, 'jest', 'transform', 'jsx'),
        '^.+\\.s?css$': path.resolve(__dirname, 'jest', 'transform', 'css'),
        '^(?!.*\\.(jsx?|s?css)$)': path.resolve(__dirname, 'jest', 'transform', 'file'),
    },
    "moduleNameMapper": {
        "shared/(.*)$": path.resolve(__dirname, '..', 'src', 'shared', '$1'),
    },
};
