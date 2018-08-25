const path = require('path');

module.exports = {
    rootDir: path.resolve(__dirname, '..', 'src', 'main'),
    testMatch: [
        '**/*.spec.js',
        '**/*.test.js',
    ],
    setupTestFrameworkScriptFile: path.resolve(__dirname, 'jest', 'setup.main.js'),
    testEnvironment: 'node',
    transform: {
        '^.+\\.js$': path.resolve(__dirname, 'jest', 'transform', 'jsx'),
    },
    "moduleNameMapper": {
        "shared/(.*)$": path.resolve(__dirname, '..', 'src', 'shared', '$1'),
    },
};
