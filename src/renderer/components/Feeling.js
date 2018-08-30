import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// The shared module is aliased and resolved by Webpack and Jest.
// You can include any file from this directory using the @shared alias.
import feelGood from '@shared/actions/feel-good';
import feelBad from '@shared/actions/feel-bad';
import style from './Feeling.module.scss';

export const Feeling = props => (
    <section className={props.className}>
        <h1 className="text-light mb-0">
            Do you like <span className="text-monospace">create-electron-app</span>?
        </h1>
        <p className="text-light mb-3">
            <small>This is just an excuse to show you how redux components work...</small>
        </p>

        <div className="row justify-content-center">
            <div className="col-6 text-center">
                <div className="btn-group">
                    {props.feel === null && (
                        <Fragment>
                            <button className={`btn btn-light ${style['btn-lg']}`} onClick={props.onGoodClick}>
                                <span role="img" aria-label="good">
                                    👍
                                </span>
                            </button>
                            <button className={`btn btn-light ${style['btn-lg']}`} onClick={props.onBadClick}>
                                <span role="img" aria-label="bad">
                                    👎
                                </span>
                            </button>
                        </Fragment>
                    )}

                    {props.feel === 'good' && (
                        <span className={style.smiley} role="img" aria-label="happy">
                            🎉
                        </span>
                    )}

                    {props.feel === 'bad' && (
                        <span className={style.smiley} role="img" aria-label="sad">
                            😥
                        </span>
                    )}
                </div>
            </div>
        </div>
    </section>
);

Feeling.propTypes = {
    className: PropTypes.string,
    onGoodClick: PropTypes.func.isRequired,
    onBadClick: PropTypes.func.isRequired,
    feel: PropTypes.oneOf([null, 'good', 'bad']),
};

Feeling.defaultProps = {
    className: '',
    feel: null,
};

export default connect(
    state => state,
    dispatch => ({
        onGoodClick: () => dispatch(feelGood()),
        onBadClick: () => dispatch(feelBad()),
    }),
)(Feeling);
