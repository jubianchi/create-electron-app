import electron, { remote, ipcRenderer } from 'electron';

window.app = remote.app;
window.versions = remote.process.versions;
window.openExternal = electron.shell.openExternal.bind(electron.shell);
window.ipc = ipcRenderer;
window.getGlobal = remote.getGlobal.bind(remote);
