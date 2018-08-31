import React from 'react';
import Commands from './Commands';
import { shallow } from 'enzyme/build';

describe('Commands', () => {
    describe('className', () => {
        test('should not be rendererd as undefined when omitted', () => {
            const wrapper = shallow(<Commands />);

            expect(wrapper.hasClass('undefined')).toBe(false);
        });

        test('should use the className if provided', () => {
            const className = 'foo';
            const wrapper = shallow(<Commands className={className} />);

            expect(wrapper.hasClass(className)).toBe(true);
        });
    });
});
