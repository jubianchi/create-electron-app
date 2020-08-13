const child = require('child_process');
const [rendererProcessConfig, mainProcessConfig] = require('./webpack.development');
const { HotModuleReplacementPlugin } = require('webpack');
const {
    paths: { resolve, dist },
} = require('./utils');

const csp = {
    default: ['none'],
    style: ['self', 'blob:'],
    script: ['self'],
    connect: ['self', `ws:`],
    img: ['self', 'data:'],
};

module.exports = [
    {
        ...rendererProcessConfig,
        plugins: [...rendererProcessConfig.plugins, new HotModuleReplacementPlugin()],
        devServer: {
            host: process.env.npm_package_config_webpack_devserver_host || '0.0.0.0',
            port: process.env.npm_package_config_webpack_devserver_port || 9000,
            publicPath: '/',
            contentBase: dist('renderer'),
            compress: true,
            hot: true,
            open: false,
            overlay: {
                warnings: false,
                errors: true,
            },
            watchContentBase: true,
            quiet: true,
            headers: {
                // Security checklist #6 and #7
                // A CSP is applied when using the devserver
                // This should also be applied to the main process so that CSP is applied in production
                // but electron does not seem to honor modified headers
                // See: https://github.com/electron/electron/issues/14342
                // https://electronjs.org/docs/tutorial/security#6-define-a-content-security-policy
                'Content-Security-Policy-Report-Only': Object.keys(csp).reduce((prev, key) => {
                    return `${prev}${prev.length > 0 ? '; ' : ''}${key}-src ${csp[key]
                        .map(value =>
                            ['none', 'self', 'unsafe-inline', 'unsafe-eval'].indexOf(value) > -1 ? `'${value}'` : value,
                        )
                        .join(' ')}`;
                }, ''),
            },
        },
    },
    {
        ...mainProcessConfig,
        plugins: [
            ...mainProcessConfig.plugins,
            {
                apply: compiler => {
                    this.electron = null;
                    this.shouldRespawn = false;

                    const spawn = () => {
                        if (this.electron) {
                            return;
                        }

                        this.electron = child.spawn(resolve('..', 'node_modules', '.bin', 'electron'), [dist()], {
                            stdio: 'inherit',
                        });

                        this.electron.on('exit', () => {
                            this.electron = null;

                            if (this.shouldRespawn) {
                                spawn();

                                this.shouldRespawn = false;
                            }
                        });
                    };

                    compiler.hooks['done'].tap({ name: 'webpack-electron-plugin' }, () => {
                        if (this.electron === null) {
                            spawn();
                        }

                        if (this.electron) {
                            this.shouldRespawn = true;

                            this.electron.kill('SIGINT');
                        }
                    });
                },
            },
        ],
    },
];
