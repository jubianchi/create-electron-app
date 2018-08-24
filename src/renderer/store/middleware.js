export default () => next => action => {
    if (({ ...action, meta: { local: false, ...action.meta } }).meta.local === false) {
        console.log('forwarding action to main', action);

        window.ipc.send('redux:dispatch', action);
    }

    return next(action);
};
