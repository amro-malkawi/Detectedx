import React from 'react';
import Header from './Header';

function MainLayout({children}) {
    return (
        <div className={'main-layout'}>
            <Header/>
            <div className={'main-content'}>
                {children}
            </div>
        </div>
    )
}

export default MainLayout;