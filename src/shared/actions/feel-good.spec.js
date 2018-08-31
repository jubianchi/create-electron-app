import feelGood, { FEEL_GOOD } from './feel-good';

describe('feelBad', () => {
    test('should create an action', () => {
        expect(feelGood()).toEqual({ type: FEEL_GOOD });
    });
});
