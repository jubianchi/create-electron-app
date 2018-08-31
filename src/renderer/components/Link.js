import React from 'react';
import PropTypes from 'prop-types';
import style from './Link.module.scss';

const Link = props => {
    const handleClick = event => {
        event.preventDefault();

        window.openExternal(event.currentTarget.href);
    };

    return (
        <a href={props.href} onClick={handleClick} className={`${style.Link} ${props.className}`}>
            {props.children}
        </a>
    );
};

Link.propTypes = {
    href: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

Link.defaultProps = {
    className: '',
};

export default Link;
