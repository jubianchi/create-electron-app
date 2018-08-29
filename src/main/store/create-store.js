import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { ipcMain } from 'electron';
import ipc from './middleware';

export default (reducers, state, middlewares = []) => {
    const enhancers = [applyMiddleware(...middlewares, ipc)];

    const store = createStore(combineReducers(reducers), state, compose(...enhancers));

    global.reduxState = store.getState();

    ipcMain.on('redux:dispatch', (event, action) => {
        console.log(`received action from renderer #${event.sender.id}`, action);

        store.dispatch({
            ...action,
            meta: {
                ...(action.meta || {}),
                sender: event.sender.id,
            },
        });
    });

    return store;
};
