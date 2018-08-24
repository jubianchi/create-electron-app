const path = require('path');
const child = require('child_process');
const [rendererProcessConfig, mainProcessConfig] = require('./webpack.development');
const { HotModuleReplacementPlugin } = require('webpack');

const make = (...parts) => parts.filter(part => !!part);
const resolve = (...parts) => path.resolve(...make(__dirname, ...parts));
const dist = (process, ...parts) => resolve('..', 'dist', process, ...parts);

module.exports = [
    {
        ...rendererProcessConfig,
        plugins: [
            ...rendererProcessConfig.plugins,
            new HotModuleReplacementPlugin(),
        ],
        devServer: {
            host: '0.0.0.0',
            port: 9000,
            publicPath: '/',
            contentBase: dist('renderer'),
            compress: true,
            hot: true,
            open: false,
            overlay: {
                warnings: false,
                errors: true
            },
            watchContentBase: true,
            quiet: true,
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

                        this.electron = child.spawn(
                            resolve('..', 'node_modules', '.bin', 'electron'),
                            [dist()],
                            {
                                stdio: 'inherit',
                            }
                        );

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
                }
            },
        ]
    }
];
