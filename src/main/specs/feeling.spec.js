describe('Feeling', () => {
    let app;

    describe('buttons', () => {
        beforeAll(async () =>
            // application() is a helper declared in config/jest/setup.main.js
            // it will ease the process of configuring and starting the application.
            (app = await application()));

        afterAll(() => stop(app));

        test('should provide a thumb up button', async () => expect((await app.client.elements('button=👍')).value.length).toBe(1));
        test('should provide a thumb down button', async () => expect((await app.client.elements('button=👎')).value.length).toBe(1));
    });

    describe('interactions', () => {
        beforeEach(async () =>
            // application() is a helper declared in config/jest/setup.main.js
            // it will ease the process of configuring and starting the application.
            (app = await application()));

        afterEach(() => stop(app));

        test('should show an happy emoji if thumb up clicked', async () => {
            await app.client.element('button=👍').click();

            expect((await app.client.elements('span=🎉')).value.length).toBe(1)
        });
        test('should show an sad emoji if thumb down clicked', async () => {
            await app.client.element('button=👎').click();

            expect((await app.client.elements('span=😥')).value.length).toBe(1)
        });
    });
});
