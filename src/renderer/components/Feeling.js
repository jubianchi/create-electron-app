import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import feelGood from 'shared/actions/feel-good';
import feelBad from 'shared/actions/feel-bad';
import style from './Feeling.module.scss';

export default connect(
    state => state,
    dispatch => ({
        onGoodClick: () => dispatch(feelGood()),
        onBadClick: () => dispatch(feelBad()),
    })
)((props) => (
    <Fragment>
        <h1 className="text-light mb-0">How much do you like <span className="text-monospace">create-electron-app</span>?</h1>
        <p className="text-muted mb-3"><small>This is just an excuse to show you how redux components work...</small></p>

        <div className={`row justify-content-center ${props.className}`}>
            <div className="col-6 text-center">
                <div className="btn-group">
                    { props.feel === null && (
                        <Fragment>
                            <button className={`btn btn-light ${style['btn-lg']}`} onClick={props.onGoodClick}>👍</button>
                            <button className={`btn btn-light ${style['btn-lg']}`} onClick={props.onBadClick}>👎</button>
                        </Fragment>
                    )}

                    { props.feel === 'good' && <span className={style.smiley}>🎉</span> }

                    { props.feel === 'bad' && <span className={style.smiley}>😥</span> }
                </div>
            </div>
        </div>
    </Fragment>
));
