import feel from './feel';
import feelGood from '../actions/feel-good';
import feelBad from '../actions/feel-bad';

describe('feelBad', () => {
    const state = 'foo';

    test('should ignore unknown actions', () => {
        expect(feel(state, { type: 'FOO_ACTION' })).toBe(state);
    });

    test('should handle FEEL_GOOD action', () => {
        expect(feel(state, feelGood())).toBe('good');
    });

    test('should handle FEEL_BAD action', () => {
        expect(feel(state, feelBad())).toBe('bad');
    });
});
