import React from 'react';
import Credits from './Credits';
import { render } from 'enzyme';

describe('Credits', () => {
    test('should render correctly', () => {
        const wrapper = render(<Credits />);

        expect(wrapper.text()).toBe('Made on the 🏖 by @jubianchi');
    });

    describe('className', () => {
        test('should not be rendererd as undefined when omitted', () => {
            const wrapper = render(<Credits />);

            expect(wrapper.hasClass('undefined')).toBe(false);
        });

        test('should use the className if provided', () => {
            const className = 'foo';
            const wrapper = render(<Credits className={className} />);

            expect(wrapper.hasClass(className)).toBe(true);
        });
    });
});
