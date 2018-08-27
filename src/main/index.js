import * as path from 'path';
import * as url from 'url';
import { app, BrowserWindow } from 'electron'
import installExtension, {REACT_PERF, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer';
import createStore from './store/create-store';
import reducers from 'shared/reducers';

let mainWindow;

app.on('ready', () => {
    if (process.env.NODE_ENV === 'development') {
        try {
            installExtension([REACT_PERF, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS])
                .then(name => console.log(`Added Extension:  ${name}`))
                .catch(err => console.log('An error occurred: ', err));
        } catch (err) {}
    }

    const cfg = {
        webPreferences: {
            nodeIntegration: false,
            preload: path.resolve(__dirname, 'preload.js'),
        }
    };

    mainWindow = new BrowserWindow({ ...cfg });

    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL(`http://localhost:9000`);
    } else {
        mainWindow.loadURL(url.format({
            pathname: path.resolve(__dirname, '..', 'renderer', 'index.html'),
            protocol: 'file:',
            slashes: true,
        }));
    }

    createStore(reducers, {
        feel: null
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

