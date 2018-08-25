import React from 'react';
import Credits from './Credits';
import { render } from 'enzyme';

describe('Application launch', () => {
    test('it should render correctly', () => {
        const wrapper = render(<Credits />);

        expect(wrapper.text()).toBe('Made on the 🏖 by @jubianchi');
    });
});
