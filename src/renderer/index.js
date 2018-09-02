import React, { StrictMode } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import './index.scss';
import createStore from './store/create-store';
// The shared module is aliased and resolved by Webpack and Jest.
// You can include any file from this directory using the @shared alias.
import reducers from '@shared/reducers';

const store = createStore(reducers);

render(
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>,
    document.querySelector('#root'),
);
