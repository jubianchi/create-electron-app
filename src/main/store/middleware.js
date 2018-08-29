import { BrowserWindow } from 'electron';

export default store => next => action => {
    if ({ ...action, meta: { local: false, ...action.meta } }.meta.local === false) {
        BrowserWindow.getAllWindows()
            .map(window => window.webContents)
            .filter(
                webContents => ({ ...action, meta: { sender: null, ...action.meta } }.meta.sender !== webContents.id),
            )
            .forEach(webContents => {
                console.log(`forwarding action to renderer #${webContents.id}`, action);

                webContents.send('redux:dispatch', action);
            });
    }

    const result = next(action);

    global.reduxState = store.getState();

    return result;
};
