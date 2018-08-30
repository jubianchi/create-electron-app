const {
    paths: { resolve, src },
} = require('./utils');

module.exports = {
    rootDir: src('shared'),
    testMatch: ['**/*.spec.js', '**/*.test.js'],
    setupTestFrameworkScriptFile: resolve('jest', 'setup.shared.js'),
    testEnvironment: 'node',
    transform: {
        '^.+\\.js$': resolve('jest', 'transform', 'js'),
    },
    collectCoverage: true,
    coverageDirectory: resolve('..', 'coverage', 'shared'),
    collectCoverageFrom: ['**/*.js'],
};
