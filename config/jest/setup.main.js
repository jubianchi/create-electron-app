import '@babel/polyfill';
import { Application } from 'spectron';
import electron from 'electron';
import { paths } from '../utils';

global.application = (options = {}) =>
    new Application({
        path: electron,
        args: [paths.dist()],
        requireName: 'electronRequire',
        ...options,
    });
