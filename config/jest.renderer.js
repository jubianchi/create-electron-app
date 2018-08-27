const { paths : { resolve, src } } = require('./utils');

module.exports = {
    rootDir: src('renderer'),
    testMatch: [
        '**/*.spec.js?(x)',
        '**/*.test.js?(x)',
    ],
    setupTestFrameworkScriptFile: resolve('jest', 'setup.renderer.js'),
    testEnvironment: 'node',
    transform: {
        '^.+\\.jsx?$': resolve('jest', 'transform', 'jsx'),
        '^.+\\.s?css$': resolve('jest', 'transform', 'css'),
        '^(?!.*\\.(jsx?|s?css)$)': resolve('jest', 'transform', 'file'),
    },
    "moduleNameMapper": {
        "shared/(.*)$": src('shared', '$1'),
    },
    "collectCoverage": true,
    "coverageDirectory": resolve('..', 'coverage', 'renderer'),
};
