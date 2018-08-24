import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import App from './components/App';
import './index.scss';
import createStore from './store/create-store';
import reducers from 'shared/reducers';

const enhancers = [];
if (process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION__) {
    enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__());
}

const store = createStore(reducers);

render(<Provider store={store}><App/></Provider>, document.querySelector('#root'));
