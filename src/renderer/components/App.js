import React from 'react';
import style from './App.module.scss';
import Versions from './Versions';
import Logos from './Logos';
import Commands from './Commands';
import Feeling from './Feeling';
import Credits from './Credits';
import { hot } from 'react-hot-loader'

export default hot(module)(() => (
    <div className={`${style.App}`}>
        <div className="container">
            <Versions className="mb-5"/>
            <h1 className="text-center text-light text-monospace mb-5">create-electron-app</h1>
            <Logos className="mb-5"/>
            <Commands className="mb-5"/>
            <Feeling className="mb-5"/>
            <Credits className="mb-5"/>
        </div>
    </div>
));
