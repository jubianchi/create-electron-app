import React from 'react';

export default (props) => (
    <div className={`row text-small text-light text-center text-monospace justify-content-center ${props.className}`}>
        <div className="col-md-4 col-lg-2 border-right">
            <small>Electron { window.versions.electron }</small>
        </div>
        <div className="col-md-4 col-lg-2 border-right">
            <small>Chrome  { window.versions.chrome }</small>
        </div>
        <div className="col-md-4 col-lg-2 border-right">
            <small>Node  { window.versions.node }</small>
        </div>
        <div className="col-md-4 col-lg-2 border-right">
            <small>v8  { window.versions.v8 }</small>
        </div>
        <div className="col-md-4 col-lg-2">
            <small>React  { React.version }</small>
        </div>
    </div>
);
