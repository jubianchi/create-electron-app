import * as path from 'path';
import * as url from 'url';
import { app, BrowserWindow, session, shell } from 'electron'
import installExtension, {REACT_PERF, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer';
import createStore from './store/create-store';
// The shared module is aliased and resolved by Webpack and Jest.
// You can include any file from this directory using the @shared alias.
import reducers from '@shared/reducers';

const createWindow = () => {
    const window = new BrowserWindow({
        show: false,
        webPreferences: {
            // Security checklist #2
            // We disable Node.js integration in renderer processes and use a preload script
            // https://electronjs.org/docs/tutorial/security#2-disable-nodejs-integration-for-remote-content
            nodeIntegration: false,
            preload: path.resolve(__dirname, 'preload.js'),
            // Security checklist #8
            // We disallow loading insecure content when the application is served over HTTPS
            // This line could be removed as `allowRunningInsecureContent` default value is `false`
            // https://electronjs.org/docs/tutorial/security#8-do-not-set-allowrunninginsecurecontent-to-true
            allowRunningInsecureContent: false,
            // Security checklist #5
            // We should never disable security features
            // This line could be removed as `webSecurity` default value is `true`
            // https://electronjs.org/docs/tutorial/security#5-do-not-disable-websecurity
            webSecurity: true,
            // Security checklist #9
            // We should never enable experimental features
            // This line could be removed as `experimentalFeatures` default value is `false`
            // https://electronjs.org/docs/tutorial/security#9-do-not-enable-experimental-features
            experimentalFeatures: false,
            // Security checklist #10
            // Same as experimental features
            // This line could be removed as `enableBlinkFeatures` are disabled by default
            //https://electronjs.org/docs/tutorial/security#10-do-not-use-enableblinkfeatures
            enableBlinkFeatures: false,
        },
    });

    if (process.env.NODE_ENV === 'development') {
        window.loadURL(url.format({
            protocol: 'http:',
            hostname: process.env.npm_package_config_webpack_devserver_host || '0.0.0.0',
            port: process.env.npm_package_config_webpack_devserver_port || 9000,
        }));
    } else {
        window.loadURL(url.format({
            pathname: path.resolve(__dirname, '..', 'renderer', 'index.html'),
            protocol: 'file:',
            slashes: true,
        }));
    }

    window.webContents.once('did-finish-load', () => {
        window.show();
    });
};

app.on('ready', () => {
    if (process.env.NODE_ENV === 'development') {
        try {
            installExtension([
                REACT_PERF,
                REACT_DEVELOPER_TOOLS,
                REDUX_DEVTOOLS,
            ])
                .then(name => console.log(`Added Extension:  ${name}`))
                .catch(err => console.log('An error occurred: ', err));
        } catch (err) {}
    }

    createStore(reducers, {
        feel: null
    });

    if (process.env.NODE_ENV !== 'production') {
        session.defaultSession.clearCache(function () {
            console.log('cache cleared');
        });
    }

    // Security checklist #4
    // We autmatically deny all permission requests
    // You may want to use custom rules to allow/deny requests
    // https://electronjs.org/docs/tutorial/security#4-handle-session-permission-requests-from-remote-content
    session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => callback(false));

    createWindow();
});

app.on('window-all-closed', () => {
    // On MacOS, even after all windows are closed applications stay "in-memory".
    // They can be reactivated at any time.
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On MacOS, even after all windows are closed applications stay "in-memory".
    // If there is no open windows we create a new one.
    if (process.platform === 'darwin' && BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('web-contents-created', (event, contents) => {
    // Security checklist #12
    // Webview configuration should always be reviewed and cleaned
    // https://electronjs.org/docs/tutorial/security#12-verify-webview-options-before-creation
    contents.on('will-attach-webview', (event, webPreferences, params) => {
        delete webPreferences.preload;
        delete webPreferences.preloadURL;

        webPreferences.nodeIntegration = false;
        webPreferences.allowRunningInsecureContent = false;
        webPreferences.webSecurity = true;
        webPreferences.experimentalFeatures = false;
        webPreferences.enableBlinkFeatures = false;

        params.blinkfeatures = '';
        params.allowpopups = false;
    });

    // Security checklist #14
    // New window should be created carefully. The default is to open URLs in the external browser.
    // https://electronjs.org/docs/tutorial/security#14-disable-or-limit-creation-of-new-windows
    contents.on('new-window', (event, navigationUrl) => {
        event.preventDefault();

        shell.openExternal(navigationUrl);
    })
});
