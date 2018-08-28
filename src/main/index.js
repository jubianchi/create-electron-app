import * as path from 'path';
import * as url from 'url';
import { app, BrowserWindow } from 'electron'
import installExtension, {REACT_PERF, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer';
import createStore from './store/create-store';
import reducers from 'shared/reducers';

const createWindow = () => {
    const window = new BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegration: false,
            preload: path.resolve(__dirname, 'preload.js'),
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
                REDUX_DEVTOOLS
            ])
                .then(name => console.log(`Added Extension:  ${name}`))
                .catch(err => console.log('An error occurred: ', err));
        } catch (err) {}
    }

    createStore(reducers, {
        feel: null
    });

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
