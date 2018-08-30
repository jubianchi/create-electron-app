import React from 'react';
import Link from './Link';
import { shallow } from 'enzyme';

describe('Link', () => {
    const href = 'link-herf';
    const text = 'link-text';

    describe('children', () => {
        test('should render text', () => {
            const wrapper = shallow(<Link href={href}>{text}</Link>);

            expect(wrapper.text()).toBe(text);
        });

        test('should render single element', () => {
            const wrapper = shallow(
                <Link href={href}>
                    <span>{text}</span>
                </Link>,
            );

            expect(wrapper.find('span').text()).toBe(text);
        });

        test('should render elements', () => {
            const wrapper = shallow(
                <Link href={href}>
                    <span>{text}</span>
                    <span>{text}</span>
                </Link>,
            );

            expect(wrapper.find('span').length).toBe(2);
        });
    });

    describe('className', () => {
        test('should not be rendererd as undefined when omitted', () => {
            const wrapper = shallow(<Link href={href}>{text}</Link>);

            expect(wrapper.hasClass('undefined')).toBe(false);
        });

        test('should use the className if provided', () => {
            const className = 'foo';
            const wrapper = shallow(
                <Link href={href} className={className}>
                    {text}
                </Link>,
            );

            expect(wrapper.hasClass(className)).toBe(true);
        });
    });

    test('should open href in external browser', () => {
        global.openExternal = jest.fn();

        const event = { preventDefault: jest.fn(), currentTarget: { href } };
        const wrapper = shallow(<Link href={href}>{text}</Link>);

        wrapper.find('a').simulate('click', event);

        expect(global.window.openExternal).toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
    });
});
