const {
    paths: { resolve, src },
} = require('./utils');

module.exports = {
    rootDir: src('main'),
    testMatch: ['**/*.spec.js', '**/*.test.js'],
    setupFilesAfterEnv: [resolve('jest', 'setup.main.js')],
    testEnvironment: 'node',
    transform: {
        '^.+\\.js$': resolve('jest', 'transform', 'js'),
    },
    moduleNameMapper: {
        '@shared/(.*)$': src('shared', '$1'),
    },
    collectCoverage: true,
    coverageDirectory: resolve('..', 'coverage', 'main'),
    collectCoverageFrom: ['**/*.js'],
};
