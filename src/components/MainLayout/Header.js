import React from 'react';
import {useSelector} from "react-redux";

function Header(props) {
    const userName = useSelector((state) => state.authUser.userName);

    return (
        <div className={'main-header d-flex flex-row align-items-center'}>
            <div className={'header-logo'}>
                <img src={require('Assets/img/main/header_logo.svg')} alt={''} />
            </div>
            <div className={'header-searchbar d-flex flex-row align-items-center'}>
                <div className={'home-icon'}>
                    <img src={require('Assets/img/main/icon_home.svg')} alt={''}/>
                </div>
                <div className={'search-input'}>
                    <input />
                    <img src={require('Assets/img/main/icon_search.svg')} alt={''}/>
                </div>
            </div>
            <div className={'header-user-info d-flex flex-row align-items-center'}>
                <img src={require('Assets/img/main/temp_user.png')} alt={''}/>
                <div className={'info-block'}>
                    <span className={'fs-23 fw-semi-bold'}>{userName}</span>
                    <div className={'fs-14'}>
                        <span>COMPLETED MODULES:</span>
                        <span className={'info-num'}>07</span>
                        <span>THIS YEARS CME POINTS:</span>
                        <span className={'info-num'}>3.25</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header;