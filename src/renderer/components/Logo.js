import React from 'react';
import PropTypes from 'prop-types';
import style from './Logo.module.scss';

const Logo = props => <img alt={props.alt} src={props.src} className={`${style.Logo} ${props.className}`} />;

Logo.propTypes = {
    alt: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
    className: PropTypes.string,
};

Logo.defaultProps = {
    className: '',
};

export default Logo;
