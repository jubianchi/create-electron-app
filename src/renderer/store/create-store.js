import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import ipc from './middleware';

export default (reducers, middlewares = []) => {
    const enhancers = [
        applyMiddleware(
            ipc,
            ...middlewares,
        ),
    ];

    if (process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION__) {
        enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__());
    }

    const store = createStore(
        combineReducers(reducers),
        window.getGlobal('reduxState'),
        compose(...enhancers)
    );

    window.ipc.on('redux:dispatch', (event, action) => {
        console.log(`received action from main${action.meta && action.meta.sender ? ` (forwarded from renderer #${action.meta.sender})` : ''}`, action);

        store.dispatch({
            ...action,
            meta: {
                ...(action.meta || {}),
                local: true
            }
        });
    });

    return store;
}
