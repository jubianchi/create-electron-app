import React from 'react';
import style from './Logo.module.scss';

export default (props) => <img alt={props.alt} src={props.src} className={style.Logo}/>;
