import React from 'react';
import Link from './Link';
import PropTypes from 'prop-types';

const Credits = props => (
    <div className={`row text-center mb-3 justify-content-center ${props.className}`}>
        <div className="col-6">
            <p className="text-light">
                <small>
                    Made on the{' '}
                    <span role="img" aria-label="beach">
                        🏖
                    </span>{' '}
                    by <Link href="https://twitter.com/jubianchi">@jubianchi</Link>
                </small>
            </p>
        </div>
    </div>
);

Credits.propTypes = {
    className: PropTypes.string,
};

Credits.defaultProps = {
    className: '',
};

export default Credits;
