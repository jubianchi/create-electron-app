import React from 'react';
import PropTypes from 'prop-types';
import ElectronLogo from './Logo-electron.svg';
import WebpackLogo from './Logo-webpack.svg';
import ReactLogo from './Logo-react.svg';
import BootstrapLogo from './Logo-bootstrap.svg';
import ReduxLogo from './Logo-redux.svg';
import JestLogo from './Logo-jest.svg';
import SpectronLogo from './Logo-spectron.svg';
import Logo from './Logo';
import Link from './Link';

const Logos = props => (
    <section className={props.className}>
        <div className="row text-center mb-3 justify-content-center">
            <div className="col-6">
                <Logo alt="Electron" src={ElectronLogo} />
            </div>
        </div>
        <div className={`row text-center text-light text-monospace justify-content-center mb-3`}>
            <div className="col-1">
                <Logo alt="Webpack" src={WebpackLogo} />
            </div>

            <div className="col-1">
                <Logo alt="React" src={ReactLogo} />
            </div>

            <div className="col-1">
                <Logo alt="Redux" src={ReduxLogo} />
            </div>

            <div className="col-1">
                <Logo alt="Bootstrap" src={BootstrapLogo} />
            </div>

            <div className="col-1">
                <Logo alt="Jest" src={JestLogo} />
            </div>

            <div className="col-1">
                <Logo alt="Spectron" src={SpectronLogo} />
            </div>
        </div>
        <div className="row text-center text-light text-monospace justify-content-center">
            <Link href="https://electronjs.org/">#electron</Link>
            &nbsp;
            <Link href="https://webpack.js.org/">#webpack</Link>
            &nbsp;
            <Link href="https://reactjs.org/">#react</Link>
            &nbsp;
            <Link href="https://redux.js.org/">#redux</Link>
            &nbsp;
            <Link href="https://getbootstrap.org/">#bootstrap</Link>
            &nbsp;
            <Link href="https://webpack.js.org/concepts/hot-module-replacement/">
                <abbr title="Hot Module Replacement" className="initialism">
                    #HMR
                </abbr>
            </Link>
            &nbsp;
            <Link href="https://sass-lang.com/">#sass</Link>
            &nbsp;
            <Link href="https://jestjs.io/">#jest</Link>
            &nbsp;
            <Link href="http://airbnb.io/enzyme/">#enzyme</Link>
            &nbsp;
            <Link href="https://electronjs.org/spectron/">#spectron</Link>
        </div>
    </section>
);

Logos.propTypes = {
    className: PropTypes.string,
};

Logos.defaultProps = {
    className: '',
};

export default Logos;
