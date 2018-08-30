import path from 'path';

const context = require.context('.', true, /(?<!index)\.js$/);

export default context
    .keys()
    .filter(key => !key.match(/\.spec\.js$/i))
    .reduce(
        (prev, key) => ({
            ...prev,
            [path.basename(key, '.js')]: context(key).default,
        }),
        {},
    );
