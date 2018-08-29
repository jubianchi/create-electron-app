import path from 'path';

const context = require.context('.', true, /(?<!index)\.js$/);

export default context.keys().reduce(
    (prev, key) => ({
        ...prev,
        [path.basename(key, '.js')]: context(key).default,
    }),
    {},
);
