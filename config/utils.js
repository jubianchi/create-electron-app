const path = require('path');

const make = (...parts) => parts.filter(part => !!part);
const resolve = (...parts) => path.resolve(...make(__dirname, ...parts));

module.exports = {
    paths: {
        resolve,
        src: (part, ...parts) => resolve('..', 'src', part, ...parts),
        dist: (part, ...parts) => resolve('..', 'dist', part, ...parts),
    },
    loaders: {
        style: (cssOptions, preProcessor) => {
            const loaders = [
                require.resolve('style-loader'),
                {
                    loader: require.resolve('css-loader'),
                    options: cssOptions,
                }
            ];

            if (preProcessor) {
                loaders.push(preProcessor);
            }

            return loaders;
        },
    }
};
