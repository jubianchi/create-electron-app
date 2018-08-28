const { paths : { resolve, dist } } = require('./utils');

module.exports = {
    appId: 'fr.jubianchi.create-electron-app',
    productName: "create-electron-app",
    directories: {
        app: dist(),
        output: resolve('..', 'packages'),
    },
    mac: {
        // Category list: https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Articles/LaunchServicesKeys.html#//apple_ref/doc/uid/TP40009250-SW8
        category: 'public.app-category.developer-tools',
    },
    dmg: {
        background: resolve('..', 'resources', 'logo.png'),
        window: {
            width: 765,
            height: 430,
        },
        contents: [
            {
                x: 140,
                y: 115,
            },
            {
                x: 625,
                y: 115,
                type: 'link',
                path: '/Applications',
            }
        ],
    },
    win: {},
    linux: {
        target: [
            {
                target: 'deb',
            },
            {
                target: 'rpm',
            },
        ],
        // Category list: https://specifications.freedesktop.org/menu-spec/latest/apa.html#main-category-registry
        category: 'Development',
    },
};
