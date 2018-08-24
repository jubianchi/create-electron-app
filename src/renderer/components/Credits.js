import React from 'react';
import Link from './Link';

export default (props) => (
    <div className={`row text-center mb-3 justify-content-center ${props.className}`}>
        <div className="col-6">
            <p className="text-light"><small>Made on the 🏖 by <Link href="https://twitter.com/jubianchi">@jubianchi</Link></small></p>
        </div>
    </div>
);
