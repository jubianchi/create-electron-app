import React from 'react';
import App from './App';
import Versions from './Versions';
import Logos from './Logos';
import Commands from './Commands';
import Feeling from './Feeling';
import Credits from './Credits';
import { shallow } from 'enzyme/build';

describe('Commands', () => {
    describe('className', () => {
        test('should render nested components', () => {
            const wrapper = shallow(<App />);

            expect(wrapper.find(Versions).length).toBe(1);
            expect(wrapper.find(Logos).length).toBe(1);
            expect(wrapper.find(Commands).length).toBe(1);
            expect(wrapper.find(Feeling).length).toBe(1);
            expect(wrapper.find(Credits).length).toBe(1);
        });

        test('should render the title', () => {
            const wrapper = shallow(<App />);

            expect(wrapper.find('h1').text()).toBe('create-electron-app');
        });
    });
});
