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
    // Strict Mode will emit some warnings about unsafe lifecycle methods being used by react-redux
    // These warnings will be fixed once react-redux@5.1.0 is released
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>,
    document.querySelector('#root'),
);
