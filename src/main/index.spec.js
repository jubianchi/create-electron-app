import { Application } from 'spectron';
const electron = require('electron');
const path = require('path');

describe('Application', () => {
    let app;

    beforeAll(async () => {
        app = new Application({
            path: electron,
            args: [path.join(__dirname, '..', '..', 'dist')],
            requireName: 'electronRequire',
        });

        return app.start();
    });

    afterAll(async () => {
        if (app && app.isRunning()) {
            return app.stop();
        }
    });

    test('should open the main window', async () => expect(await app.client.getWindowCount()).toBe(1));
    test('should have a title', async () => expect(await app.client.getTitle()).toBe('create-electron-app'));
    test('should comply to accessibility standards', async () =>
        app.client.auditAccessibility().then(audit => {
            const severe = audit.results.filter(message => message.severity === 'Severe');

            if (audit.failed) {
                severe.forEach(message => console.log(message));
            }

            expect(severe.length).toBe(0);
        }));
});
