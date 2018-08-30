import feelBad, { FEEL_BAD } from './feel-bad';

describe('feelBad', () => {
    test('should create an action', () => {
        expect(feelBad()).toEqual({ type: FEEL_BAD });
    });
});
