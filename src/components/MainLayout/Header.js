import React from 'react';
import {useSelector} from "react-redux";
import {useHistory} from 'react-router-dom';
import * as selectors from "Selectors";

function Header(props) {
    const history = useHistory();
    const isLogin = selectors.getIsLogin(null);
    const userName = useSelector((state) => state.authUser.userName);
    const userCompletedCount = useSelector((state) => state.authUser.completedCount);

    const getAvatarChars = () => {
        const names = userName.split(' ');
        if(names.length >= 2) {
            return names[0][0] + names[1][0];
        } else {
            return names[0][0] + names[0][1];
        }
    }

    return (
        <div className={'main-header d-flex flex-row align-items-center'}>
            <div className={'header-logo'}>
                <img src={require('Assets/img/main/header_logo.png')} alt={''} />
            </div>
            <div className={'header-searchbar d-flex flex-row align-items-center'}>
                <div className={'home-icon'} onClick={() => history.push('/main')}>
                    <img src={require('Assets/img/main/icon_home.svg')} alt={''}/>
                </div>
                <div className={'search-input'}>
                    <input />
                    <img src={require('Assets/img/main/icon_search.svg')} alt={''}/>
                </div>
            </div>
            <div className={'header-user-info d-flex flex-row align-items-center'}>
                <div className={'header-user-avatar'} onClick={() => history.push('/main/profile')}>
                    {/*<img src={require('Assets/img/main/temp_user.png')} alt={''}/>*/}
                    {
                        isLogin ?
                            <span>{getAvatarChars()}</span> :
                            <i className={'zmdi zmdi-account'} />
                    }
                </div>
                <div className={'info-block'}>
                    {
                        isLogin ?
                            <span className={'fs-23 fw-semi-bold'}>{userName}</span>:
                            <span className={'fs-23 fw-semi-bold'}>Login</span>
                    }
                    <div className={'fs-14'}>
                        <span>COMPLETED MODULES:</span>
                        <span className={'info-num'}>{isLogin ? userCompletedCount : ''}</span>
                        <span>THIS YEARS CME POINTS:</span>
                        <span className={'info-num'}>{isLogin ? 3.25 : ''}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header;