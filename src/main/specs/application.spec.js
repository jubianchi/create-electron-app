import { Application } from 'spectron';
const electron = require('electron');
const path = require('path');

describe('Application', () => {
    let app;

    beforeAll(() => {
        app = new Application({
            path: electron,
            args: [path.join(__dirname, '..', '..', '..', 'dist')]
        });

        return app.start();
    });

    afterAll(() => {
        if (app && app.isRunning()) {
            return app.stop();
        }
    });

    test('it should open the main window', async () => expect(await app.client.getWindowCount()).toBe(1));
    test('it should have a title', async () => expect(await app.client.getTitle()).toBe('create-electron-app'));
});
