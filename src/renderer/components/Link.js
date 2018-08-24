import React from 'react';
import style from './Link.module.scss';

export default (props) => {
    const handleClick = event => {
        event.preventDefault();

        window.openExternal(event.currentTarget.href);
    };

    return <a href={props.href} onClick={handleClick} className={`${style.Link} ${props.className}`}>{props.children}</a>;
};
