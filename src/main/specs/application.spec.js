describe('Application', () => {
    let app;

    beforeAll(async () =>
        // application() is a helper declared in config/jest/setup.main.js
        // it will ease the process of configuring and starting the application.
        (app = await application()));

    afterAll(() => stop(app));

    test('should open the main window', async () => expect(await app.client.getWindowCount()).toBe(1));
    test('should have a title', async () => expect(await app.client.getTitle()).toBe('create-electron-app'));
    test('should comply to accessibility standards', async () =>
        app.client.auditAccessibility({ ignoreWarnings: true }).then(audit => {
            if (audit.failed) {
                audit.results.forEach(message => console.log(message));
            }

            expect(audit.failed).toBe(false);
        }));
});
