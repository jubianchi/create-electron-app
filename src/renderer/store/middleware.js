export default () => next => action => {
    if ({ ...action, meta: { local: false, ...action.meta } }.meta.local === false) {
        let actionToForward;

        switch (action.type) {
            case 'PERFORM_ACTION':
                actionToForward = action.action;
                break;

            default:
                actionToForward = action;
                break;
        }

        console.log('forwarding action to main', actionToForward);

        window.ipc.send('redux:dispatch', actionToForward);
    }

    return next(action);
};
