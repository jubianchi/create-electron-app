const {
    paths: { resolve, src },
} = require('./utils');

module.exports = {
    rootDir: src('renderer'),
    testMatch: ['**/*.spec.js?(x)', '**/*.test.js?(x)'],
    setupFilesAfterEnv: [resolve('jest', 'setup.renderer.js')],
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.jsx?$': resolve('jest', 'transform', 'jsx'),
        '^(?!.*\\.(jsx?|s?css)$)': resolve('jest', 'transform', 'file'),
    },
    moduleNameMapper: {
        '@shared/(.*)$': src('shared', '$1'),
        // We use identity-obj-proxy as the styles transformer so that classnames are correctly resolved:
        //
        // ```js
        // import style from 'foo.scss';
        //
        // console.log(foo.myClass); // 'myClass'
        // ```
        '^.+\\.(sa|s?c)ss$': 'identity-obj-proxy',
    },
    collectCoverage: true,
    coverageDirectory: resolve('..', 'coverage', 'renderer'),
    collectCoverageFrom: ['**/*.{js,jsx}'],
};
