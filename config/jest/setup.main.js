import '@babel/polyfill';
import { Application } from 'spectron';
import electron from 'electron';
import { paths } from '../utils';

/**
 * Helper to ease the process of configuring and starting the application.
 *
 * @param {Object} options Options to use to configure and start the application (see https://github.com/electron/spectron#new-applicationoptions)
 *                         An extra option is available: `autoStart`. Its default value is `true` meaning the application will automatically be start
 *                         but you can set it to `false` if you want to start it manually
 *
 * @returns {Promise<module:spectron.Application>}
 */
global.application = async (options = {}) => {
    const autoStart = options.hasOwnProperty('autoStart') ? options.autoStart : true;

    delete options.autoStart;

    const app = new Application({
        path: electron,
        args: [paths.dist()],
        requireName: 'electronRequire',
        ...options,
    });

    if (autoStart) {
        return app.start();
    }

    return app;
};

/**
 * Helper to ease the process of stopping the application
 *
 * @param {module:spectron.Application} application The application to stop
 *
 * @returns {Promise<module:spectron.Application|null>}
 */
global.stop = application => (application && application.isRunning() ? application.stop() : null);
