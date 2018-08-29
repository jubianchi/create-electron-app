import { FEEL_GOOD } from '../actions/feel-good';
import { FEEL_BAD } from '../actions/feel-bad';

export default (state = null, action) => {
    switch (action.type) {
        case FEEL_GOOD:
            return 'good';

        case FEEL_BAD:
            return 'bad';

        default:
            return state;
    }
};
