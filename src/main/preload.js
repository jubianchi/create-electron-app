import electron, { remote, ipcRenderer } from 'electron';

window.app = remote.app;
window.versions = remote.process.versions;
window.openExternal = electron.shell.openExternal.bind(electron.shell);
window.ipc = ipcRenderer;
window.getGlobal = remote.getGlobal.bind(remote);

// Spectron must be allowed to access Electron's APIs
// https://github.com/electron/spectron#node-integration
if (process.env.NODE_ENV === 'test') {
    window.electronRequire = eval('require');
}
