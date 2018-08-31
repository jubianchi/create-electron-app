import React from 'react';
import Logos from './Logos';
import { shallow } from 'enzyme';

describe('Logos', () => {
    describe('className', () => {
        test('should not be rendererd as undefined when omitted', () => {
            const wrapper = shallow(<Logos />);

            expect(wrapper.hasClass('undefined')).toBe(false);
        });

        test('it should use the className property', () => {
            const className = 'foo';
            const wrapper = shallow(<Logos className={className} />);

            expect(wrapper.hasClass(className)).toBe(true);
        });
    });
});
