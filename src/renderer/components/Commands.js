import React, { Fragment } from 'react';

export default props => (
    <Fragment>
        <div className={`row justify-content-center mb-3`}>
            <div className="col">
                <p className="text-light">
                    To run the local <em>development</em> environment, execute the following command:
                </p>
                <pre className="bg-light p-3 rounded text-left">
                    <span className="text-info">$</span> <span className="text-success">npm</span> start
                </pre>
            </div>
        </div>

        <div className={`row justify-content-center mb-3`}>
            <div className="col">
                <p className="text-light">
                    To build a <em>development</em> version of the application, execute one of the following command:
                </p>
                <pre className="bg-light p-3 rounded text-left">
                    <span className="text-info">$</span> <span className="text-success">npm</span> run build
                    {'\n'}
                    <span className="text-muted"># or</span>
                    {'\n'}
                    <span className="text-info">$</span> NODE_ENV=development <span className="text-success">npm</span>{' '}
                    run build
                </pre>

                <p className="text-light">
                    To build a <em>production</em> version of the application, execute the following command:
                </p>
                <pre className="bg-light p-3 rounded text-left">
                    <span className="text-info">$</span> NODE_ENV=production <span className="text-success">npm</span>{' '}
                    run build
                </pre>
            </div>
        </div>

        <div className={`row justify-content-center mb-3`}>
            <div className="col">
                <p className="text-light">
                    To run the full (main and renderer processes) test suite, execute the following command:
                </p>
                <pre className="bg-light p-3 rounded text-left">
                    <span className="text-info">$</span> <span className="text-success">npm</span> test
                </pre>

                <p className="text-light">
                    To only run one of the two test suites, execute one of the following command:
                </p>
                <pre className="bg-light p-3 rounded text-left">
                    <span className="text-info">$</span> <span className="text-success">npm</span> run test:renderer
                    {'\n'}
                    <span className="text-muted"># or</span>
                    {'\n'}
                    <span className="text-info">$</span> <span className="text-success">npm</span> run test:main
                    {'\n'}
                </pre>
            </div>
        </div>

        <div className={`row justify-content-center ${props.className}`}>
            <div className="col">
                <p className="text-light">To run the application, execute the following command:</p>
                <pre className="bg-light p-3 rounded text-left">
                    <span className="text-info">$</span> <span className="text-success">npm</span> run electron
                </pre>
            </div>
        </div>
    </Fragment>
);
