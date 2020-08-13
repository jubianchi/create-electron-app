import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ConnectedFeeling, { Feeling } from './Feeling';
import { render, mount } from 'enzyme';
import { FEEL_GOOD } from '../../shared/actions/feel-good';
import { FEEL_BAD } from '../../shared/actions/feel-bad';

describe('Feeling', () => {
    const onGoodClick = jest.fn();
    const onBadClick = jest.fn();

    describe('className', () => {
        test('should not be rendererd as undefined when omitted', () => {
            const wrapper = render(<Feeling onGoodClick={onGoodClick} onBadClick={onBadClick} />);

            expect(wrapper.hasClass('undefined')).toBe(false);
        });

        test('should use the className property', () => {
            const className = 'foo';
            const wrapper = render(<Feeling className={className} onGoodClick={onGoodClick} onBadClick={onBadClick} />);

            expect(wrapper.hasClass(className)).toBe(true);
        });
    });

    test('should show an happy emoji if feeling is good', () => {
        const className = 'foo';
        const wrapper = render(
            <Feeling className={className} onGoodClick={onGoodClick} onBadClick={onBadClick} feel="good" />,
        );

        expect(wrapper.text()).toContain('🎉');
    });

    test('should show an sad emoji if feeling is good', () => {
        const className = 'foo';
        const wrapper = render(
            <Feeling className={className} onGoodClick={onGoodClick} onBadClick={onBadClick} feel="bad" />,
        );

        expect(wrapper.text()).toContain('😥');
    });

    // This is how you would test a connected component
    // We use redux-mock-store
    // https://github.com/dmitry-zaets/redux-mock-store
    describe('connected', () => {
        // First, create a mock store
        const mockStore = configureStore();
        const store = mockStore();

        // Then wrap you component in the redux provider with the mock store
        const wrapper = mount(
            <Provider store={store}>
                <ConnectedFeeling />
            </Provider>,
        );

        it('should dispatch the feelGood action', () => {
            wrapper.find('button').first().simulate('click');

            expect(store.getActions()).toContainEqual({ type: FEEL_GOOD });
        });

        it('should dispatch the feelBad action', () => {
            wrapper.find('button').last().simulate('click');

            expect(store.getActions()).toContainEqual({ type: FEEL_BAD });
        });
    });
});
