import React from 'react';
import Logo from './Logo';
import { shallow } from 'enzyme';

describe('Logo', () => {
    const alt = 'logo-alt';
    const src = 'logo-src';

    test('it should render correctly', () => {
        const wrapper = shallow(<Logo alt={alt} src={src} />);

        expect(wrapper.prop('alt')).toBe(alt);
        expect(wrapper.prop('src')).toBe(src);
    });

    describe('className', () => {
        test('should not be rendererd as undefined when omitted', () => {
            const wrapper = shallow(<Logo alt={alt} src={src} />);

            expect(wrapper.hasClass('undefined')).toBe(false);
        });

        test('it should use the className property', () => {
            const className = 'foo';
            const wrapper = shallow(<Logo alt={alt} src={src} className={className} />);

            expect(wrapper.hasClass(className)).toBe(true);
        });
    });
});
