import React from 'react';
import {isMobile} from 'react-device-detect';
import classNames from 'classnames';
import Header from './Header';

function MainLayout({children}) {
    return (
        <div className={classNames('main-layout', {'mobile-layout': isMobile})}>
            <Header/>
            <div className={'main-content'}>
                {children}
            </div>
        </div>
    )
}

export default MainLayout;